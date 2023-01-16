import {
    generateFixedPeriods,
    getAdjacentFixedPeriods,
} from '@dhis2/multi-calendar-dates'
import { useMemo } from 'react'
import {
    formatJsDateToDateString,
    useClientServerDate,
    useClientServerDateUtils,
    yearlyFixedPeriodTypes,
} from '../../shared/index.js'

export default function usePeriods({ periodType, openFuturePeriods, year }) {
    const { fromClientDate } = useClientServerDateUtils()
    const currentDate = useClientServerDate()
    const currentDay = formatJsDateToDateString(currentDate.serverDate)
    // @TODO(calendar)
    const calendar = 'gregory'

    return useMemo(
        () => {
            if (!periodType) {
                return []
            }

            const periodsUntilNow = generateFixedPeriods({
                calendar,
                periodType,
                year,
                endsBefore: currentDay,

                // only used when generating yearly periods, so save to use
                // here, regardless of the period type.
                // + 1 so we include 1970 as well
                yearsCount: year - 1970 + 1,
            })

            // In case we're currently in the first period of the year, we need
            // to get the last period of the previous year to get the future
            // periods
            const lastCompletedPeriod =
                periodsUntilNow[
                    // yearly periods are displayed in reversed order
                    yearlyFixedPeriodTypes.includes(periodType)
                        ? 0
                        : periodsUntilNow.length - 1
                ] ||
                generateFixedPeriods({
                    calendar,
                    periodType,
                    year: year - 1,
                }).slice(-1)[0]

            const futurePeriods = openFuturePeriods
                ? getAdjacentFixedPeriods({
                      period: lastCompletedPeriod,
                      calendar,
                      steps: openFuturePeriods,
                  })
                : []

            return yearlyFixedPeriodTypes.includes(periodType)
                ? // yearly periods are displayed in reversed order
                  [...futurePeriods, ...periodsUntilNow]
                : [
                      ...periodsUntilNow,
                      // Unless yearly, we only want to display periods of
                      // the current year
                      ...futurePeriods.filter(
                          (period) =>
                              new Date(period.startDate).getFullYear() === year
                      ),
                  ]
        },
        // Adding `currentDay` to the dependency array so this hook will
        // recompute the date limit when the actual date changes
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [periodType, currentDay, openFuturePeriods, year, fromClientDate]
    )
}
