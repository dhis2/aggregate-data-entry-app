import { useEffect } from 'react'
import { useClientServerDateUtils } from '../date/index.js'
import { getCurrentDate } from '../fixed-periods/index.js'
import { useMetadata, selectors } from '../metadata/index.js'
import { usePeriod } from '../period/index.js'
import {
    usePeriodId,
    useDataSetId,
    useOrgUnitId,
} from '../use-context-selection/use-context-selection.js'
import { useDataValueSet } from '../use-data-value-set/use-data-value-set.js'
import { useOrgUnit } from '../use-org-unit/use-organisation-unit.js'
import { LockedStates, BackendLockStatusMap } from './locked-states.js'
import { useLockedContext } from './use-locked-context.js'

const DAY_MS = 24 * 60 * 60 * 1000

/** Check for status relative to dataInputPeriods and expiryDays */
const getFrontendLockStatus = ({
    dataSetId,
    metadata,
    selectedPeriod,
    clientServerDateUtils: { fromServerDate, fromClientDate },
}) => {
    if (!selectedPeriod) {
        return
    }

    const dataSet = selectors.getDataSetById(metadata, dataSetId)
    if (!dataSet) {
        return
    }

    const { expiryDays, dataInputPeriods } = dataSet
    if (dataInputPeriods.length === 0 && expiryDays === 0) {
        // Nothing to check here then
        return
    }

    let clientLockDate
    const currentDate = fromClientDate(getCurrentDate())

    if (dataInputPeriods.length > 0) {
        const applicableDataInputPeriod =
            selectors.getApplicableDataInputPeriod(
                metadata,
                dataSetId,
                selectedPeriod.id
            )

        if (!applicableDataInputPeriod) {
            // If there are defined data input periods, but there is not one
            // for this selected period, then the form is closed
            return {
                state: LockedStates.LOCKED_DATA_INPUT_PERIOD,
                lockDate: null,
            }
        }

        const { openingDate, closingDate } = applicableDataInputPeriod
        // openingDate and closingDate can be undefined.
        // They are ISO dates without a timezone, so should be parsed
        // as "server dates"
        const parsedOpeningDate =
            openingDate && fromServerDate(new Date(openingDate))
        const parsedClosingDate =
            closingDate && fromServerDate(new Date(closingDate))

        console.log({ parsedClosingDate, parsedOpeningDate })

        if (
            (openingDate &&
                currentDate.serverDate < parsedOpeningDate.serverDate) ||
            (closingDate &&
                currentDate.serverDate > parsedClosingDate.serverDate)
        ) {
            return {
                state: LockedStates.LOCKED_DATA_INPUT_PERIOD,
                lockDate: null,
            }
        }

        // If we're here, the form isn't (yet) locked by the data input period.
        // Set the clientLockDate to the input period's closing date (if this
        // input period has one) before also checking expiry days.
        // This might still be undefined, but that's okay
        clientLockDate = parsedClosingDate?.clientDate
    }

    if (expiryDays > 0) {
        // selectedPeriod.endDate is a string like '2023-02-20' -- this gets
        // converted to a UTC time by default, but adding 'T00:00'
        // to make an ISO string makes Date() parse it in the local zone.
        // I.e., the UTC time is adjusted to give us the right server clock
        // time but in the LOCAL time zone. This is the "server date" we need
        // for the `clientServerDateUtils`.
        const serverEndDate = new Date(selectedPeriod.endDate + 'T00:00')
        // Convert that to ms to add expiry days.
        // Also add one day more because selectedPeriod.endDate is the START
        // of the period's last day (00:00), and we want the end of that day
        // (confirmed with backend behavior).
        const expiryDate = fromServerDate(
            new Date(serverEndDate.getTime() + (expiryDays + 1) * DAY_MS)
        )

        if (currentDate.serverDate < expiryDate.serverDate) {
            // Take the sooner of the two possible lock dates
            clientLockDate = clientLockDate
                ? new Date(Math.min(clientLockDate, expiryDate.clientDate))
                : expiryDate.clientDate
            // ! NB:
            // This value is still shown, even if a form won't actually lock
            // for a user due to superuser or lock exceptions, which might be
            // misleading. That would take checking those exceptions on the
            // front end, which are currently done on the backend
        }

        // If this form is actually expired, don't lock it here; leave that
        // to the backend check, which can account for F_EDIT_EXPIRED
        // authorities or lock exceptions
        // TODO: implement this full check on the front-end (TECH-1428)
    }

    return { state: LockedStates.OPEN, lockDate: clientLockDate }
}

const isOrgUnitLocked = ({
    orgUnitOpeningDateString,
    orgUnitClosedDateString,
    selectedPeriod,
}) => {
    // if period start or end is undefined or if both opening and closed date are undefined for org unit, skip check
    if (
        !selectedPeriod?.startDate ||
        !selectedPeriod?.endDate ||
        (!orgUnitOpeningDateString && !orgUnitClosedDateString)
    ) {
        return false
    }
    // since all the dates are the same (server) time zone, we do not need to do server/client time zone adjustments

    // for the purpose of these calculations, dates are effecitvely treated as days without hours
    // for example, if org unit closing date is 2020-12-31, the period December 2020 should still be open for the org unit
    const periodStartDate = new Date(selectedPeriod.startDate + 'T00:00')
    const periodEndDate = new Date(selectedPeriod.endDate + 'T00:00')

    // if orgUnitOpeningDate exists, it must be earlier than the periodStartDate
    if (orgUnitOpeningDateString) {
        const orgUnitOpeningDate = new Date(orgUnitOpeningDateString)
        if (!(orgUnitOpeningDate <= periodStartDate)) {
            return true
        }
    }

    // if orgUnitClosedDate exists, it must be after the periodEndDate
    if (orgUnitClosedDateString) {
        const orgUnitClosedDate = new Date(orgUnitClosedDateString)
        if (!(orgUnitClosedDate >= periodEndDate)) {
            return true
        }
    }

    // otherwise default to assuming not locked
    return false
}

export const useCheckLockStatus = () => {
    const [dataSetId] = useDataSetId()
    const [orgUnitId] = useOrgUnitId()
    const orgUnit = useOrgUnit()
    const {
        data: {
            openingDate: orgUnitOpeningDateString,
            closedDate: orgUnitClosedDateString,
        } = {},
    } = orgUnit

    const [periodId] = usePeriodId()
    const selectedPeriod = usePeriod(periodId)

    const clientServerDateUtils = useClientServerDateUtils()

    const { data: metadata } = useMetadata()
    const dataValueSet = useDataValueSet()
    const { setLockStatus } = useLockedContext()

    useEffect(() => {
        // prefer lock status from backend, found in dataValueSet
        const backendLockStatus =
            BackendLockStatusMap[dataValueSet.data?.lockStatus]
        if (backendLockStatus) {
            setLockStatus({ state: backendLockStatus })
            return
        }

        // if either 1. backend status is 'OPEN' or 2. it's not defined yet,
        // refine the lock status here from properties on the dataSet:
        // (a lock status of 'OPEN' from the backend could mean either that the
        // form is open, OR that the form should be locked due to data input
        // period OR org unit closure.)
        // Therefore, check org unit openness first:
        if (
            isOrgUnitLocked({
                orgUnitOpeningDateString,
                orgUnitClosedDateString,
                selectedPeriod,
            })
        ) {
            setLockStatus({ state: LockedStates.LOCKED_ORGANISATION_UNIT })
            return
        }

        // Then, check the dataInputPeriod boundaries, and if the form IS
        // open, get the date the form will close, if applicable.
        const frontendLockStatus = getFrontendLockStatus({
            dataSetId,
            selectedPeriod,
            metadata,
            clientServerDateUtils,
        })
        if (frontendLockStatus) {
            setLockStatus(frontendLockStatus)
            return
        }


        // otherwise denote as open
        setLockStatus({ state: LockedStates.OPEN })
    }, [
        metadata,
        dataSetId,
        orgUnitId,
        orgUnitOpeningDateString,
        orgUnitClosedDateString,
        clientServerDateUtils,
        dataValueSet.data?.lockStatus,
        setLockStatus,
        selectedPeriod,
    ])
}
