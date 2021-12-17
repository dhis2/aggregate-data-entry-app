import {
    getCurrentDate,
    getFixedPeriodsForTypeAndDateRange,
    isValidPeriodType,
} from '../../shared/index.js'

export default function getMostRecentCompletedYear(periodType) {
    if (!isValidPeriodType(periodType)) {
        throw new Error(
            `Invalid periodType "${periodType}" supplied to "getMostRecentCompletedYear"`
        )
    }

    const endDate = getCurrentDate()
    let year = endDate.getFullYear()
    let periods = getFixedPeriodsForTypeAndDateRange(
        periodType,
        `${endDate.getFullYear()}-01-01`,
        endDate
    )

    if (periods.length > 0) {
        return year
    } else {
        /**
         * Practically speaking we could also just return `year - 1` here
         * but this logic would allow for periods to span over multiple years
         */
        while (periods.length === 0) {
            --year
            periods = getFixedPeriodsForTypeAndDateRange(
                periodType,
                `${year}-01-01`,
                `${year}-12-31`
            )
        }
        return year
    }
}
