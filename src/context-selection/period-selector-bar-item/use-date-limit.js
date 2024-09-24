import { useConfig } from '@dhis2/app-runtime'
import {
    getAdjacentFixedPeriods,
    getFixedPeriodByDate,
} from '@dhis2/multi-calendar-dates'
import { useMemo } from 'react'
import {
    selectors,
    useDataSetId,
    useMetadata,
    periodTypesMapping,
    getNowInCalendarString,
} from '../../shared/index.js'

export const computePeriodDateLimit = ({
    periodType,
    dateServerInCalendarString,
    openFuturePeriods = 0,
    calendar = 'gregory',
}) => {
    const date = dateServerInCalendarString
    const currentPeriod = getFixedPeriodByDate({
        periodType,
        date,
        calendar,
    })

    if (openFuturePeriods <= 0) {
        return currentPeriod.startDate
    }

    const followingPeriods = getAdjacentFixedPeriods({
        period: currentPeriod,
        calendar,
        steps: openFuturePeriods,
    })

    const [lastFollowingPeriod] = followingPeriods.slice(-1)

    return lastFollowingPeriod.startDate
}

/**
 * Returns the first date that is exluded. For example the currend period type
 * is 'Daily' and two open future periods are allowed, then the date limit is
 * two days ahead as that's the first day that's not allowed (the current
 * period is a considered afuture period)
 */
export const useDateLimit = () => {
    const { systemInfo = {} } = useConfig()
    const { calendar = 'gregory', serverTimeZoneId: timezone = 'UTC' } =
        systemInfo
    const [dataSetId] = useDataSetId()
    const { data: metadata } = useMetadata()

    const dateServerInCalendarString = getNowInCalendarString(
        calendar,
        timezone
    )

    return useMemo(
        () => {
            const dataSet = selectors.getDataSetById(metadata, dataSetId)

            if (!dataSet) {
                return dateServerInCalendarString
            }

            const periodType = periodTypesMapping[dataSet.periodType]
            const openFuturePeriods = dataSet.openFuturePeriods || 0

            return computePeriodDateLimit({
                periodType,
                openFuturePeriods,
                dateServerInCalendarString,
                calendar,
            })
        },

        // Adding `dateWithoutTime` to the dependency array so this hook will
        // recompute the date limit when the actual date changes
        [dataSetId, metadata, dateServerInCalendarString, calendar]
    )
}
