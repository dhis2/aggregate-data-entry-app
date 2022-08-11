import { useMemo } from 'react'
import {
    startYear,
    yearlyPeriodTypes,
    addFullPeriodTimeToDate,
    getCurrentDate,
    getFixedPeriodsForTypeAndDateRange,
    getYearlyPeriodIdForTypeAndYear,
    parsePeriodId,
} from '../../shared/index.js'

export default function usePeriods({
    periodType,
    futurePeriods,
    openFuturePeriods,
    year,
}) {
    return useMemo(() => {
        if (!periodType) {
            return []
        }

        let periods
        const currentDate = getCurrentDate()
        const currentYear = currentDate.getFullYear()
        const relevantFuturePeriods = futurePeriods.filter((futurePeriod) => {
            return (
                new Date(futurePeriod.startDate).getFullYear() === currentYear
            )
        })

        if (yearlyPeriodTypes.includes(periodType)) {
            const futureYearLimit = new Date(currentDate)
            futureYearLimit.setFullYear(
                currentDate.getFullYear() + openFuturePeriods
            )
            const yearsCount =
                currentDate.getFullYear() - startYear + openFuturePeriods
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
        } else if (year > currentYear) {
            periods = futurePeriods.filter(
                ({ startDate, endDate }) =>
                    new Date(startDate).getFullYear() === year ||
                    new Date(endDate).getFullYear() === year
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

            const fixedPeriods = getFixedPeriodsForTypeAndDateRange({
                periodType,
                startDate: `${year}-01-01`,
                endDate: year === currentYear ? currentDate : nextYearLimitDate,
            })

            periods = [
                ...fixedPeriods,
                ...(year >= currentYear ? relevantFuturePeriods : []),
            ]
        }

        return periods.reverse()
    }, [openFuturePeriods, periodType, futurePeriods, year])
}
