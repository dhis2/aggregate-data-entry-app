import { getNowInCalendar as getNowInCalendarOriginal } from '@dhis2/multi-calendar-dates'

export const getNowInCalendar = (calendar, timezone) => {
    return getNowInCalendarOriginal(calendar, timezone)
}
