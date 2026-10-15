import {
    formatCalendarDate,
    getNowInCalendar,
} from '@dhis2/multi-calendar-dates'

export const getNowInCalendarString = ({
    calendar = 'gregory',
    timezone = 'Etc/UTC',
    long = false,
} = {}) => {
    const now = getNowInCalendar(calendar, timezone)
    return formatCalendarDate(now, { includeTime: long })
}
