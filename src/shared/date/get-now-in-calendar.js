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

const stringifyDate = (temporalDate, long, calendar) => {
    const year = ['ethiopian', 'ethiopic'].includes(calendar)
        ? temporalDate.eraYear
        : temporalDate.year
    const shortDate = `${pad(year, 4, '0')}-${pad(
        temporalDate.month,
        2,
        '0'
    )}-${pad(temporalDate.day, 2, '0')}`
    if (!long) {
        return shortDate
    }
    return `${shortDate}T${pad(temporalDate.hour, 2, '0')}:${pad(
        temporalDate.minute,
        2,
        '0'
    )}:${pad(temporalDate.second, 2, '0')}`
}

export const getNowInCalendarString = ({
    calendar = 'gregory',
    timezone = 'Etc/UTC',
    long = false,
}) => {
    const nowTemporal = getNowInCalendar(calendar, timezone)
    return stringifyDate(nowTemporal, long, calendar)
}
