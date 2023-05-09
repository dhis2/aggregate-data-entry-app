import { generateFixedPeriods } from '@dhis2/multi-calendar-dates'
import { useMemo } from 'react'
import {
    formatJsDateToDateString,
    useClientServerDate,
    useUserInfo,
    yearlyFixedPeriodTypes,
} from '../../shared/index.js'

export default function usePeriods({
    periodType,
    year,
    dateLimit,
    // only required when periodType is a yearly period type
    openFuturePeriods,
}) {
    // @TODO(calendar)
    const calendar = 'gregory'
    const { data: userInfo } = useUserInfo()
    const { keyUiLocale: locale } = userInfo.settings
    const currentDate = useClientServerDate()
    const currentDay = formatJsDateToDateString(currentDate.serverDate)

    return useMemo(() => {
        // Adding `currentDay` to the dependency array so this hook will
        // recompute the date limit when the actual date changes
        currentDay

        if (!periodType) {
            return []
        }

        const isYearlyPeriodType = yearlyFixedPeriodTypes.includes(periodType)
        const yearForGenerating = isYearlyPeriodType
            ? year + openFuturePeriods
            : year
        // dateLimit is converted to YYYY-MM-DD string named endsBefore before being passed
        const endsBefore = dateLimit.toLocaleDateString('sv')

        const generateFixedPeriodsPayload = {
            calendar,
            periodType,
            year: yearForGenerating,
            endsBefore,
            locale,

            // only used when generating yearly periods, so save to use
            // here, regardless of the period type.
            // + 1 so we include 1970 as well
            yearsCount: yearForGenerating - 1970 + 1,
        }
        const periods = generateFixedPeriods(generateFixedPeriodsPayload)

        if (isYearlyPeriodType) {
            return periods
        }

        const [lastPeriodOfPrevYear] = generateFixedPeriods({
            ...generateFixedPeriodsPayload,
            year: yearForGenerating - 1,
        }).slice(-1)
        const [firstPeriodNextYear] = generateFixedPeriods({
            ...generateFixedPeriodsPayload,
            year: yearForGenerating + 1,
        })

        // we want to display the last period of the previous year if it
        // stretches into the current year
        if (
            lastPeriodOfPrevYear &&
            `${year}-01-01` <= lastPeriodOfPrevYear.endDate
        ) {
            const [lastPeriodOfPrevYear] = generateFixedPeriods({
                ...generateFixedPeriodsPayload,
                year: yearForGenerating - 1,
            }).slice(-1)

            periods.unshift(lastPeriodOfPrevYear)
        }

        // if we're allowed to display the first period of the next year, we
        // want to display the first period of the next year if it starts in
        // the current year
        if (
            firstPeriodNextYear &&
            `${year + 1}-01-01` > firstPeriodNextYear.startDate
        ) {
            periods.push(firstPeriodNextYear)
        }

        return periods.reverse()
    }, [periodType, currentDay, year, dateLimit, locale, openFuturePeriods])
}
