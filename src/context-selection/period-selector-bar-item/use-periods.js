import moment from 'moment'
import { useMemo } from 'react'
import {
    YEARLY,
    FINANCIAL_APRIL,
    FINANCIAL_JULY,
    FINANCIAL_OCT,
    FINANCIAL_NOV,
    addFullPeriodTimeToDate,
    getCurrentDate,
    getFixedPeriodsForTypeAndDateRange,
    getYearlyPeriodIdForTypeAndYear,
    parsePeriodId,
} from '../../shared/index.js'

const yearlyPeriodTypes = [
    YEARLY,
    FINANCIAL_APRIL,
    FINANCIAL_JULY,
    FINANCIAL_OCT,
    FINANCIAL_NOV,
]

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
            const yearsCount =
                getCurrentDate().getFullYear() - 1970 + openFuturePeriods
            periods = Array.from(Array(yearsCount)).map((_, index) => {
                const year = index + 1970
                const periodId = getYearlyPeriodIdForTypeAndYear(
                    periodType,
                    year
                )
                return parsePeriodId(periodId)
            })
        } else if (year > currentYear) {
            return futurePeriods.filter(
                ({ startDate }) => new Date(startDate).getFullYear() === year
            )
        } else {
            const fixedPeriods = getFixedPeriodsForTypeAndDateRange({
                periodType,
                startDate: `${year}-01-01`,
                endDate:
                    year === currentYear
                        ? moment(currentDate).format('YYYY-MM-DD')
                        : // Make sure we add options that start this year but span into
                          // the next year if we're not in the current year
                          addFullPeriodTimeToDate(`${year}-12-31`, periodType),
            })

            periods = [
                ...fixedPeriods,
                ...(year >= currentYear ? relevantFuturePeriods : []),
            ]
        }

        return periods.reverse()
    }, [openFuturePeriods, periodType, futurePeriods, year])
}
