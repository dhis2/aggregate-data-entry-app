import { useEffect } from 'react'
import { useNowAtServerTimezone } from '../index.js'
import { useMetadata, selectors } from '../metadata/index.js'
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
    nowAtServerTimezone,
}) => {
    const dataInputPeriod = selectors.getApplicableDataInputPeriod(
        metadata,
        dataSetId,
        periodId
    )

    if (!dataInputPeriod) {
        return false
    }

    const openingDate = new Date(dataInputPeriod.openingDate)
    const closingDate = new Date(dataInputPeriod.closingDate)

    return (
        openingDate > nowAtServerTimezone || closingDate < nowAtServerTimezone
    )
}

export const useCheckLockStatus = () => {
    const [dataSetId] = useDataSetId()
    const [orgUnitId] = useOrgUnitId()
    const [periodId] = usePeriodId()
    const nowAtServerTimezone = useNowAtServerTimezone()
    const { data: metadata } = useMetadata()
    const { setLockStatus } = useLockedContext()
    const dataValueSet = useDataValueSet()

    useEffect(() => {
        if (
            isDataInputPeriodLocked({
                dataSetId,
                periodId,
                metadata,
                nowAtServerTimezone,
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
        nowAtServerTimezone,
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
        return
    }

    // if the lock status is LOCKED, this is locked due to expiry days
    if (backEndLockStatus === 'LOCKED') {
        setLockStatus(LockedStates.LOCKED_EXPIRY_DAYS)
        return
    }

    // a lock status of 'OPEN' from the backend could mean either that the form is open OR
    // that the form should be locked due to data input period, SO
    // set to OPEN unless frontend check has identified that data input period as out-of-bounds
    if (frontEndLockStatus !== LockedStates.LOCKED_DATA_INPUT_PERIOD) {
        setLockStatus(LockedStates.OPEN)
    }
}
