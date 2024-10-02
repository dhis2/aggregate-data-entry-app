import { useConfig } from '@dhis2/app-runtime'
import { useEffect } from 'react'
import {
    getNowInCalendarString,
    addDaysToDateString,
    isDateAGreaterThanDateB,
    isDateALessThanDateB,
} from '../date/index.js'
import { useMetadata, selectors } from '../metadata/index.js'
import { usePeriod } from '../period/index.js'
import {
    usePeriodId,
    useDataSetId,
} from '../use-context-selection/use-context-selection.js'
import { useDataValueSet } from '../use-data-value-set/use-data-value-set.js'
import { useOrgUnit } from '../use-org-unit/use-organisation-unit.js'
import { useUserInfo, userInfoSelectors } from '../use-user-info/index.js'
import { LockedStates, BackendLockStatusMap } from './locked-states.js'
import { useLockedContext } from './use-locked-context.js'

/** Check for status relative to dataInputPeriods and expiryDays */
const getFrontendLockStatus = ({
    dataSetId,
    metadata,
    selectedPeriod,
    userCanEditExpired,
    calendar,
    timezone,
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

    let serverLockDateString = null

    // this will be a date string corrected for client/server time zone differences
    const currentDateString = getNowInCalendarString({
        calendar,
        timezone,
        long: true,
    })

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

        // date comparison
        if (
            (openingDate &&
                isDateALessThanDateB(currentDateString, openingDate, {
                    calendar,
                    inclusive: false,
                })) ||
            (closingDate &&
                isDateAGreaterThanDateB(currentDateString, closingDate, {
                    calendar,
                    inclusive: false,
                }))
        ) {
            return {
                state: LockedStates.LOCKED_DATA_INPUT_PERIOD,
                lockDate: null,
            }
        }

        // If we're here, the form isn't (yet) locked by the data input period.
        serverLockDateString = closingDate
    }

    if (expiryDays > 0 && !userCanEditExpired) {
        // selectedPeriod.endDate is a string like '2023-02-20' -- this gets
        // converted to a UTC time by default, but adding 'T00:00'

        // Add one day more because selectedPeriod.endDate is the START
        // of the period's last day (00:00), and we want the end of that day
        // (confirmed with backend behavior).
        // this will currently be null if calendar is not gregory
        const expiryDateString = addDaysToDateString({
            startDateString: selectedPeriod.endDate,
            days: expiryDays + 1,
            calendar,
        })

        // date comparison
        if (
            currentDateString &&
            expiryDateString &&
            isDateALessThanDateB(currentDateString, expiryDateString, {
                calendar,
                inclusive: false,
            })
        ) {
            // Take the sooner of the two possible lock dates
            serverLockDateString = isDateALessThanDateB(
                serverLockDateString,
                expiryDateString,
                { calendar, inclusive: false }
            )
                ? serverLockDateString
                : expiryDateString
            // ! NB:
            // Until lock exception checks are done, this value is still shown,
            // even if the form won't actually lock due to a lock exception.
            // This may be misleading
        }

        // If this form is actually expired, don't lock it here; leave that
        // to the backend check, which can account for lock exceptions
        // TODO: implement this full check on the front-end (TECH-1428)
    }

    return { state: LockedStates.OPEN, lockDate: serverLockDateString }
}

const isOrgUnitLocked = ({
    orgUnitOpeningDateString,
    orgUnitClosedDateString,
    selectedPeriod,
    calendar = 'gregory',
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

    // note: period dates are without times (assumed to be T00:00), but org units can have time information

    const periodStartDate = selectedPeriod.startDate
    const periodEndDate = selectedPeriod.endDate

    // date comparison
    // if orgUnitOpeningDate exists, it must be earlier than the periodStartDate
    if (orgUnitOpeningDateString) {
        if (
            !isDateALessThanDateB(orgUnitOpeningDateString, periodStartDate, {
                calendar,
                inclusive: true,
            })
        ) {
            return true
        }
    }

    // if orgUnitClosedDate exists, it must be after the periodEndDate
    if (orgUnitClosedDateString) {
        if (
            !isDateAGreaterThanDateB(orgUnitClosedDateString, periodEndDate, {
                calendar,
                inclusive: true,
            })
        ) {
            return true
        }
    }

    // otherwise default to assuming not locked
    return false
}

export const useCheckLockStatus = () => {
    const [dataSetId] = useDataSetId()
    const orgUnit = useOrgUnit()
    const {
        data: {
            openingDate: orgUnitOpeningDateString,
            closedDate: orgUnitClosedDateString,
        } = {},
    } = orgUnit

    const [periodId] = usePeriodId()
    const selectedPeriod = usePeriod(periodId)

    const { data: metadata } = useMetadata()
    const dataValueSet = useDataValueSet()
    const { setLockStatus } = useLockedContext()

    const { data: userInfo } = useUserInfo()
    const userCanEditExpired = userInfoSelectors.getCanEditExpired(userInfo)

    const { systemInfo = {} } = useConfig()
    const { calendar = 'gregory', serverTimeZoneId: timezone = 'Etc/UTC' } =
        systemInfo

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
                calendar,
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
            userCanEditExpired,
            calendar,
            timezone,
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
        orgUnitOpeningDateString,
        orgUnitClosedDateString,
        userCanEditExpired,
        dataValueSet.data?.lockStatus,
        setLockStatus,
        selectedPeriod,
        calendar,
        timezone,
    ])
}
