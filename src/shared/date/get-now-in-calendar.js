import { getNowInCalendar } from '@dhis2/multi-calendar-dates'
import { padWithZeros } from './date-utils.js'

const stringifyDate = (temporalDate, long, calendar) => {
    const year = ['ethiopian', 'ethiopic'].includes(calendar)
        ? temporalDate.eraYear
        : temporalDate.year
    const shortDate = `${padWithZeros(year, 4)}-${padWithZeros(
        temporalDate.month,
        2
    )}-${padWithZeros(temporalDate.day, 2)}`
    if (!long) {
        return shortDate
    }
    return `${shortDate}T${padWithZeros(temporalDate.hour, 2)}:${padWithZeros(
        temporalDate.minute,
        2
    )}:${padWithZeros(temporalDate.second, 2)}`
}

export const getNowInCalendarString = ({
    calendar = 'gregory',
    timezone = 'Etc/UTC',
    long = false,
} = {}) => {
    const nowTemporal = getNowInCalendar(calendar, timezone)
    return stringifyDate(nowTemporal, long, calendar)
}
