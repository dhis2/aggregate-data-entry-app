import { useMemo } from 'react'
import {
    startYear,
    yearlyPeriodTypes,
    addFullPeriodTimeToDate,
    getFixedPeriodsForTypeAndDateRange,
    getYearlyPeriodIdForTypeAndYear,
    parsePeriodId,
    getCurrentDate,
    formatJsDateToDateString,
    useClientServerDate,
    useClientServerDateUtils,
} from '../../shared/index.js'

export default function usePeriods({
    periodType,
    openFuturePeriods,
    year,
    dateLimit,
}) {
    const currentDate = getCurrentDate()
    const { fromClientDate } = useClientServerDateUtils({
        clientDate: currentDate,
    })
    const clientServerDate = useClientServerDate({ clientDate: currentDate })
    const adjustedCurrentDateString = formatJsDateToDateString(
        clientServerDate.serverDate
    )

    return useMemo(
        () => {
            if (!periodType) {
                return []
            }

            let periods
            const { serverDate } = fromClientDate(getCurrentDate())

            if (yearlyPeriodTypes.includes(periodType)) {
                const futureYearLimit = new Date(serverDate)
                const validFuturePeriods =
                    openFuturePeriods >= 0 ? openFuturePeriods : 0
                futureYearLimit.setFullYear(
                    serverDate.getFullYear() + validFuturePeriods
                )
                const yearsCount =
                    serverDate.getFullYear() - startYear + validFuturePeriods
                periods = Array.from(Array(yearsCount))
                    .map((_, index) => {
                        const year = index + startYear
                        const periodId = getYearlyPeriodIdForTypeAndYear(
                            periodType,
                            year
                        )
                        return parsePeriodId(periodId)
                    })
                    .filter(
                        ({ endDate }) => new Date(endDate) < futureYearLimit
                    )
            } else {
                // Make sure we add options that start this year but span into
                // the next year if we're not in the current year
                // limit is between the first and second start dates of the following year
                const nextYearLimitDate = addFullPeriodTimeToDate(
                    `${year + 1}-01-01`,
                    periodType
                )
                nextYearLimitDate.setDate(nextYearLimitDate.getDate() - 1)

                periods = getFixedPeriodsForTypeAndDateRange({
                    periodType,
                    startDate: `${year}-01-01`,
                    endDate: new Date(Math.min(dateLimit, nextYearLimitDate)),
                })
            }

            return periods.reverse()
        },
        // Adding `adjustedCurrentDateString` to the dependency array so this hook will
        // recompute the date limit when the actual date changes
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [
            periodType,
            adjustedCurrentDateString,
            openFuturePeriods,
            year,
            dateLimit,
            fromClientDate,
        ]
    )
}
