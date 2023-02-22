import { useEffect } from 'react'
import { formatJsDateToDateString, useClientServerDate } from '../date/index.js'
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

const isDataInputPeriodLocked = ({
    dataSetId,
    periodId,
    metadata,
    currentDayString,
}) => {
    const dataInputPeriod = selectors.getApplicableDataInputPeriod(
        metadata,
        dataSetId,
        periodId
    )

    if (!dataInputPeriod) {
        return false
    }

    const currentDateAtServerTimeZone = new Date(currentDayString)
    const openingDate = new Date(dataInputPeriod.openingDate)
    const closingDate = new Date(dataInputPeriod.closingDate)

    return (
        openingDate > currentDateAtServerTimeZone ||
        closingDate < currentDateAtServerTimeZone
    )
}

/** Check for status relative to dataInputPeriods and expiryDays */
const getFrontendLockStatus = ({
    dataSetId,
    periodId,
    metadata,
    currentDayString,
    selectedPeriod,
}) => {
    const applicableDataInputPeriod = selectors.getApplicableDataInputPeriod(
        metadata,
        dataSetId,
        periodId
    )
    const expiryDays = selectors.getDataSetById(metadata, dataSetId).expiryDays

    if (!applicableDataInputPeriod && !expiryDays) {
        // Nothing to check here then
        return null
    }

    let lockDate
    const currentDateAtServerTimeZone = new Date(currentDayString)

    if (applicableDataInputPeriod) {
        const { openingDate, closingDate } = applicableDataInputPeriod
        // openingDate and closingDate can be undefined
        const parsedOpeningDate = openingDate && new Date(openingDate)
        const parsedClosingDate = closingDate && new Date(closingDate)

        if (
            (openingDate && currentDateAtServerTimeZone < parsedOpeningDate) ||
            (closingDate && currentDateAtServerTimeZone > parsedClosingDate)
        ) {
            return {
                status: LockedStates.LOCKED_DATA_INPUT_PERIOD,
                lockDate: null,
            }
        } else {
            // This might still be undefined, but that's okay
            lockDate = parsedClosingDate
        }
    }

    if (expiryDays > 0) {
        const hourMs = 60 * 60 * 1000
        const dayMs = hourMs * 24
        // Do operations in ms
        const expiryDate = new Date(
            new Date(selectedPeriod.endDate).getTime() +
                // Add one day pecause selectedPeriod.endDate is 00:00 of the last
                // day of the period (i.e. 24 hours before when the period ends),
                // and we want midnight of the day it expires
                (expiryDays + 1) * dayMs
        )

        if (currentDateAtServerTimeZone < expiryDate) {
            // Take the sooner of the two possible lock dates
            lockDate = lockDate
                ? new Date(Math.min(lockDate, expiryDate))
                : expiryDate
            // This value might be misleading if a superuser or lock exception
            // would override it; it would take checking those on the front end
        }

        // If this form is actually expired, don't lock it here; leave that
        // to the backend check, which can account for superuser exceptions or
        // lock exceptions
    }

    return { status: LockedStates.OPEN, lockDate }
}

export const useCheckLockStatus = () => {
    const [dataSetId] = useDataSetId()
    const [orgUnitId] = useOrgUnitId()
    const [periodId] = usePeriodId()
    const currentDate = useClientServerDate()
    const currentDayString = formatJsDateToDateString(currentDate.serverDate)
    const { data: metadata } = useMetadata()
    const { setLockStatus } = useLockedContext()
    const dataValueSet = useDataValueSet()
    const selectedPeriod = usePeriod(periodId)

    useEffect(() => {
        const frontendLockStatus = getFrontendLockStatus({
            dataSetId,
            periodId,
            metadata,
            currentDayString,
            selectedPeriod,
        })
        console.log({ frontendLockStatus })
        // if (frontendLockStatus) setLockStatus(frontendLockStatus); return

        if (
            isDataInputPeriodLocked({
                dataSetId,
                periodId,
                metadata,
                currentDayString,
            })
        ) {
            // mark as invalid for data input period
            setLockStatus(LockedStates.LOCKED_DATA_INPUT_PERIOD)
            return
        }

        // else default to lockStatus from dataValueSet
        if (BackendLockStatusMap[dataValueSet.data?.lockStatus]) {
            setLockStatus(BackendLockStatusMap[dataValueSet.data?.lockStatus])
            return
        }

        // otherwise denote as open
        setLockStatus(LockedStates.OPEN)
    }, [
        metadata,
        dataSetId,
        orgUnitId,
        periodId,
        dataValueSet.data?.lockStatus,
        setLockStatus,
        currentDayString,
        selectedPeriod,
    ])
}

export const updateLockStatusFromBackend = (
    frontEndLockStatus,
    backEndLockStatus,
    setLockStatus
) => {
    // if the lock status is APPROVED, set to approved
    if (backEndLockStatus === 'APPROVED') {
        setLockStatus(LockedStates.LOCKED_APPROVED)
        // { status: LockedStatus.LOCKED_APPROVED, lockDate: null }
        return
    }

    // if the lock status is LOCKED, this is locked due to expiry days
    if (backEndLockStatus === 'LOCKED') {
        setLockStatus(LockedStates.LOCKED_EXPIRY_DAYS)
        // { status: LockedStatus.LOCKED_EXPIRY_DAYS, lockDate: null }
        return
    }

    // a lock status of 'OPEN' from the backend could mean either that the form is open OR
    // that the form should be locked due to data input period, SO
    // set to OPEN unless frontend check has identified that data input period as out-of-bounds
    if (frontEndLockStatus !== LockedStates.LOCKED_DATA_INPUT_PERIOD) {
        setLockStatus(LockedStates.OPEN)
        // { status: LockedStates.OPEN, lockDate: null }
    }
}
