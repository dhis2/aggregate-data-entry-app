import { generateFixedPeriods } from '@dhis2/multi-calendar-dates'
import moment from 'moment'
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

        const yearForGenerating = yearlyFixedPeriodTypes.includes(periodType)
            ? year + openFuturePeriods
            : year
        const endsBefore = moment(dateLimit).format('yyyy-MM-DD')

        return generateFixedPeriods({
            calendar,
            periodType,
            year: yearForGenerating,
            endsBefore,
            locale,

            // only used when generating yearly periods, so save to use
            // here, regardless of the period type.
            // + 1 so we include 1970 as well
            yearsCount: yearForGenerating - 1970 + 1,
        })
    }, [periodType, currentDay, year, dateLimit, locale, openFuturePeriods])
}
