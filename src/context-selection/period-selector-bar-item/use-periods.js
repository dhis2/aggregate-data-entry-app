import { useConfig } from '@dhis2/app-runtime'
import { generateFixedPeriods } from '@dhis2/multi-calendar-dates'
import { useMemo } from 'react'
import { getNowInCalendarString } from '../../shared/date/get-now-in-calendar.js'
import {
    useUserInfo,
    yearlyFixedPeriodTypes,
    startingYears,
    isDateALessThanDateB,
    isDateAGreaterThanDateB,
} from '../../shared/index.js'

export default function usePeriods({
    periodType,
    year,
    dateLimit,
    // only required when periodType is a yearly period type
    openFuturePeriods,
}) {
    const { systemInfo = {} } = useConfig()
    const { calendar = 'gregory', serverTimeZoneId: timezone = 'Etc/UTC' } =
        systemInfo

    const { data: userInfo } = useUserInfo()
    const { keyUiLocale: locale } = userInfo.settings
    const currentDayString = getNowInCalendarString({ calendar, timezone })

    return useMemo(() => {
        // Adding `currentDayString` to the dependency array so this hook will
        // recompute the date limit when the actual date changes

        if (!periodType || !calendar) {
            return []
        }

        const isYearlyPeriodType = yearlyFixedPeriodTypes.includes(periodType)
        const yearForGenerating = isYearlyPeriodType
            ? year + openFuturePeriods
            : year

        const generateFixedPeriodsPayload = {
            calendar,
            periodType,
            year: yearForGenerating,
            endsBefore: dateLimit,
            locale,

            // only used when generating yearly periods, so save to use
            // here, regardless of the period type.
            // + 1 so we include the starting year as well
            yearsCount:
                yearForGenerating -
                (startingYears[calendar] ?? startingYears.default) +
                1,
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
        // date comparison (both are system calendar)
        if (
            lastPeriodOfPrevYear &&
            isDateALessThanDateB(
                { date: `${year}-01-01`, calendar },
                { date: lastPeriodOfPrevYear.endDate, calendar },
                {
                    inclusive: true,
                }
            )
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
        // date comparison
        if (
            firstPeriodNextYear &&
            // `${year + 1}-01-01` > firstPeriodNextYear.startDate
            // date comparison (both in system calendar)
            isDateAGreaterThanDateB(
                { date: `${year + 1}-01-01`, calendar },
                { date: firstPeriodNextYear.startDate, calendar },
                { inclusive: false }
            )
        ) {
            periods.push(firstPeriodNextYear)
        }

        return periods.reverse()
    }, [
        periodType,
        currentDayString,
        year,
        dateLimit,
        locale,
        openFuturePeriods,
        calendar,
    ])
}
