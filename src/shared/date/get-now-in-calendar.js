import { getNowInCalendar } from '@dhis2/multi-calendar-dates'
import { padWithZeros } from './date-utils.js'

const stringifyDate = (date, long, calendar) => {
    const year = ['ethiopian', 'ethiopic'].includes(calendar)
        ? date.eraYear
        : date.year
    const shortDate = `${padWithZeros(year, 4)}-${padWithZeros(
        date.month,
        2
    )}-${padWithZeros(date.day, 2)}`
    if (!long) {
        return shortDate
    }
    return `${shortDate}T${padWithZeros(date.hour, 2)}:${padWithZeros(
        date.minute,
        2
    )}:${padWithZeros(date.second, 2)}`
}

export const getNowInCalendarString = ({
    calendar = 'gregory',
    timezone = 'Etc/UTC',
    long = false,
} = {}) => {
    const now = getNowInCalendar(calendar, timezone)
    return stringifyDate(now, long, calendar)
}
