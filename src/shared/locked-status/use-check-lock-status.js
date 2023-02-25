import { useEffect } from 'react'
import { useClientServerDateUtils } from '../date/index.js'
import { getCurrentDate } from '../fixed-periods/index.js'
import { useMetadata, selectors } from '../metadata/index.js'
import usePeriod from '../period/use-period.js'
import {
    usePeriodId,
    useDataSetId,
    useOrgUnitId,
} from '../use-context-selection/use-context-selection.js'
import { useDataValueSet } from '../use-data-value-set/use-data-value-set.js'
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
    const applicableDataInputPeriod = selectors.getApplicableDataInputPeriod(
        metadata,
        dataSetId,
        selectedPeriod?.id
    )
    const expiryDays = selectors.getDataSetById(metadata, dataSetId)?.expiryDays

    if (!applicableDataInputPeriod && !expiryDays) {
        // Nothing to check here then
        return null
    }

    let clientLockDate
    const currentDate = fromClientDate(getCurrentDate())

    if (applicableDataInputPeriod) {
        const { openingDate, closingDate } = applicableDataInputPeriod
        // openingDate and closingDate can be undefined.
        // They are local to the server
        const parsedOpeningDate =
            openingDate && fromServerDate(new Date(openingDate))
        const parsedClosingDate =
            closingDate && fromServerDate(new Date(closingDate))

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
        } else {
            // This might still be undefined, but that's okay
            clientLockDate = parsedClosingDate?.clientDate
        }
    }

    if (expiryDays > 0) {
        // selectedPeriod.endDate is a string like '2023-02-20' --
        // convert that to a date and get time to get ms to add expiry days.
        // Also add one day more because selectedPeriod.endDate is the START
        // of the period's last day (00:00), and we want the end of that day
        // (confirmed with backend behavior).
        // Converting the selectedPeriod.endDate string to an object creates
        // it in the client's timezone; parse it from there.
        const expiryDate = fromClientDate(
            new Date(
                new Date(selectedPeriod.endDate).getTime() +
                    (expiryDays + 1) * DAY_MS
            )
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
        // to the backend check, which can account for superuser exceptions or
        // lock exceptions
    }

    return { state: LockedStates.OPEN, lockDate: clientLockDate }
}

export const useCheckLockStatus = () => {
    const [dataSetId] = useDataSetId()
    const [orgUnitId] = useOrgUnitId()
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
        // form is open OR that the form should be locked due to data input
        // period.)
        // Therefore, check the dataInputPeriod boundaries, and if the form IS
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
        clientServerDateUtils,
        dataValueSet.data?.lockStatus,
        setLockStatus,
        selectedPeriod,
    ])
}
