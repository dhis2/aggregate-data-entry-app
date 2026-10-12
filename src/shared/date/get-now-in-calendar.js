import { getNowInCalendar } from '@dhis2/multi-calendar-dates'
import { padWithZeros } from './date-utils.js'

// getNowInCalendar only returns the calendar date (no time of day),
// so the time is derived separately for the given time zone
const getTimeOfDayInTimezone = (timezone) => {
    const parts = new Intl.DateTimeFormat('en-US', {
        timeZone: timezone,
        hourCycle: 'h23',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
    }).formatToParts(new Date())
    const get = (type) => parts.find((part) => part.type === type)?.value
    return { hour: get('hour'), minute: get('minute'), second: get('second') }
}

const stringifyDate = ({ date, time, long, calendar }) => {
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
    return `${shortDate}T${padWithZeros(time.hour, 2)}:${padWithZeros(
        time.minute,
        2
    )}:${padWithZeros(time.second, 2)}`
}

export const getNowInCalendarString = ({
    calendar = 'gregory',
    timezone = 'Etc/UTC',
    long = false,
} = {}) => {
    const date = getNowInCalendar(calendar, timezone)
    const time = long ? getTimeOfDayInTimezone(timezone) : undefined
    return stringifyDate({ date, time, long, calendar })
}
