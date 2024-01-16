import {
    getAdjacentFixedPeriods,
    getFixedPeriodByDate,
} from '@dhis2/multi-calendar-dates'
import { useMemo } from 'react'
import {
    selectors,
    useDataSetId,
    useMetadata,
    formatJsDateToDateString,
    getCurrentDate,
    periodTypesMapping,
    useClientServerDateUtils,
    useClientServerDate,
} from '../../shared/index.js'

export const getDateInTimeZone = (dateString) => {
    const [yyyy, mm, dd] = dateString.split('-')
    if (isNaN(Number(yyyy)) || isNaN(Number(dd)) || isNaN(Number(mm))) {
        return new Date(dateString)
    }
    return new Date(yyyy, Number(mm) - 1, dd)
}

export const computePeriodDateLimit = ({
    periodType,
    serverDate,
    openFuturePeriods = 0,
}) => {
    const calendar = 'gregory'
    // serverDate is converted to YYYY-MM-DD string named date before being passed
    const date = serverDate.toLocaleDateString('sv')
    const currentPeriod = getFixedPeriodByDate({
        periodType,
        date,
        calendar,
    })

    if (openFuturePeriods <= 0) {
        return getDateInTimeZone(currentPeriod.startDate)
    }

    const followingPeriods = getAdjacentFixedPeriods({
        period: currentPeriod,
        calendar,
        steps: openFuturePeriods,
    })

    const [lastFollowingPeriod] = followingPeriods.slice(-1)

    return getDateInTimeZone(lastFollowingPeriod.startDate)
}

/**
 * Returns the first date that is exluded. For example the currend period type
 * is 'Daily' and two open future periods are allowed, then the date limit is
 * two days ahead as that's the first day that's not allowed (the current
 * period is a considered afuture period)
 */
export const useDateLimit = () => {
    const [dataSetId] = useDataSetId()
    const { data: metadata } = useMetadata()
    const { fromClientDate } = useClientServerDateUtils()
    const currentDate = useClientServerDate()
    const currentDay = formatJsDateToDateString(currentDate.serverDate)

    return useMemo(
        () => {
            const currentDate = fromClientDate(getCurrentDate())
            const dataSet = selectors.getDataSetById(metadata, dataSetId)

            if (!dataSet) {
                return currentDate.serverDate
            }

            const periodType = periodTypesMapping[dataSet.periodType]
            const openFuturePeriods = dataSet.openFuturePeriods || 0

            return computePeriodDateLimit({
                periodType,
                openFuturePeriods,
                serverDate: currentDate.serverDate,
            })
        },

        // Adding `dateWithoutTime` to the dependency array so this hook will
        // recompute the date limit when the actual date changes
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [dataSetId, metadata, currentDay, fromClientDate]
    )
}
