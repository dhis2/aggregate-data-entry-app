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
} from '../../shared/index.js'
import { getNowInCalendar } from './get-now-in-calendar.js'

const pad = (startValue, minLength, padString) => {
    try {
        const startString = String(startValue)
        return startString.padStart(minLength, padString)
    } catch (e) {
        console.error(e)
        return startValue
    }
}

const stringifyDate = (temporalDate) => {
    return `${pad(temporalDate.eraYear, 4, '0')}-${pad(
        temporalDate.month,
        2,
        '0'
    )}-${pad(temporalDate.day, 2, '0')}`
}

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

    const nowServerInCalendar = getNowInCalendar(calendar, timezone)
    const dateServerInCalendarString = stringifyDate(nowServerInCalendar)

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
