import { useEffect } from 'react'
import { formatJsDateToDateString, useClientServerDate } from '../date/index.js'
import { useMetadata, selectors } from '../metadata/index.js'
import { usePeriod } from '../period/index.js'
import {
    usePeriodId,
    useDataSetId,
    useOrgUnitId,
} from '../use-context-selection/index.js'
import { useDataValueSet } from '../use-data-value-set/use-data-value-set.js'
import { useOrgUnit } from '../use-org-unit/use-organisation-unit.js'
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

/**
 * An org unit is locked not based on the current date,
 * but based on the selected period.
 *
 * -> If org unit's close date is before the period's end date,
 *    then the user is not allowed to modify data.
 *
 * -> If the org unit's open date is after the period's start date,
 *    then the user is not allowed to modify data.
 */
const isOrgUnitTimeConstraintWithinDataInputPeriodConstraint = ({
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
        if (orgUnitOpeningDate > periodStartDate) {
            return true
        }
    }

    // if orgUnitClosedDate exists, it must be after the periodEndDate
    if (orgUnitClosedDateString) {
        const orgUnitClosedDate = new Date(orgUnitClosedDateString)
        if (orgUnitClosedDate < periodEndDate) {
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
    const currentDate = useClientServerDate()
    const currentDayString = formatJsDateToDateString(currentDate.serverDate)
    const { data: metadata } = useMetadata()
    const { setLockStatus } = useLockedContext()
    const dataValueSet = useDataValueSet()

    useEffect(() => {
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

        if (
            isOrgUnitTimeConstraintWithinDataInputPeriodConstraint({
                orgUnitOpeningDateString,
                orgUnitClosedDateString,
                selectedPeriod,
            })
        ) {
            setLockStatus(LockedStates.LOCKED_ORGANISATION_UNIT)
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
        orgUnitOpeningDateString,
        orgUnitClosedDateString,
        periodId,
        selectedPeriod,
        dataValueSet.data?.lockStatus,
        setLockStatus,
        currentDayString,
    ])
}
