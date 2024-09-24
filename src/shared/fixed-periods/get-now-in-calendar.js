import { getNowInCalendar } from '@dhis2/multi-calendar-dates'

const pad = (startValue, minLength, padString) => {
    try {
        const startString = String(startValue)
        return startString.padStart(minLength, padString)
    } catch (e) {
        console.error(e)
        return startValue
    }
}

const stringifyDate = (temporalDate) => {
    return `${pad(temporalDate.eraYear, 4, '0')}-${pad(
        temporalDate.month,
        2,
        '0'
    )}-${pad(temporalDate.day, 2, '0')}`
}

export const getNowInCalendarString = (
    calendar = 'gregory',
    timezone = 'Etc/UTC'
) => {
    const nowTemporal = getNowInCalendar(calendar, timezone)
    return stringifyDate(nowTemporal)
}
