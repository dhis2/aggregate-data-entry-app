import { useMemo } from 'react'
import {
    startYear,
    yearlyPeriodTypes,
    addFullPeriodTimeToDate,
    getFixedPeriodsForTypeAndDateRange,
    getYearlyPeriodIdForTypeAndYear,
    parsePeriodId,
    useNowAtServerTimezone,
} from '../../shared/index.js'

export default function usePeriods({
    periodType,
    openFuturePeriods,
    year,
    dateLimit,
}) {
    const nowAtServerTimezone = useNowAtServerTimezone()
    const dateString = nowAtServerTimezone.toISOString().split('T')[0]

    return useMemo(() => {
        if (!periodType) {
            return []
        }

        let periods
        const currentDate = new Date(dateString)

        if (yearlyPeriodTypes.includes(periodType)) {
            const futureYearLimit = new Date(currentDate)
            const validFuturePeriods =
                openFuturePeriods >= 0 ? openFuturePeriods : 0
            futureYearLimit.setFullYear(
                currentDate.getFullYear() + validFuturePeriods
            )
            const yearsCount =
                currentDate.getFullYear() - startYear + validFuturePeriods
            periods = Array.from(Array(yearsCount))
                .map((_, index) => {
                    const year = index + startYear
                    const periodId = getYearlyPeriodIdForTypeAndYear(
                        periodType,
                        year
                    )
                    return parsePeriodId(periodId)
                })
                .filter(({ endDate }) => new Date(endDate) < futureYearLimit)
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
    }, [periodType, dateString, openFuturePeriods, year, dateLimit])
}
