import moment from 'moment'
import { getNowInCalendarString } from './get-now-in-calendar.js'

const GREGORY_CALENDARS = ['gregory', 'gregorian', 'iso8601', 'julian'] // calendars that can be parsed by JS Date
const DAY_MS = 24 * 60 * 60 * 1000
const DATE_ONLY_REGEX = new RegExp(/^\d{4}-\d{2}-\d{2}$/)

export const padWithZeros = (startValue, minLength) => {
    try {
        const startString = String(startValue)
        return startString.padStart(minLength, '0')
    } catch (e) {
        console.error(e)
        return startValue
    }
}
const formatDate = (date, withoutTimeStamp) => {
    const yearString = padWithZeros(date.getFullYear(), 4)
    const monthString = padWithZeros(date.getMonth() + 1, 2) // Jan = 0
    const dateString = padWithZeros(date.getDate(), 2)
    const hoursString = padWithZeros(date.getHours(), 2)
    const minuteString = padWithZeros(date.getMinutes(), 2)
    const secondsString = padWithZeros(date.getSeconds(), 2)

    if (withoutTimeStamp) {
        return `${yearString}-${monthString}-${dateString}`
    }
    return `${yearString}-${monthString}-${dateString}T${hoursString}:${minuteString}:${secondsString}`
}

// returns string in either 'YYYY-MM-DD' or 'YYYY-MM-DDTHH:MM.SSS' format (depending on input)
// if non-gregory calendar, returns null
// time zone will not be affected by browser conversion so long as initial date is not expressly UTC
export const addDaysToDateString = ({
    startDateString,
    days,
    calendar = 'gregory',
}) => {
    if (!GREGORY_CALENDARS.includes(calendar)) {
        // TO DO: add support for non-gregory calendar
        return null
    }

    // if the startDate does not have time stamp, then add it
    // adding T00:00 will prevent the date from being parsed in UTC time zone
    // (parsing as UTC relative to browser time zone can alter the date)
    const withoutTimeStamp = DATE_ONLY_REGEX.test(startDateString)
    const adjustedStartDateString = withoutTimeStamp
        ? startDateString + 'T00:00'
        : startDateString

    const startDate = new Date(adjustedStartDateString)
    const endDate = new Date(startDate.getTime() + days * DAY_MS)

    // we return the YYYY-MM-DD format if that was what was originally passed

    return formatDate(endDate, withoutTimeStamp)
}

// returns relative time between two dates
// if endDate is not provided, assumes end is now
// if non-gregory calendar, returns null
export const getRelativeTime = ({ startDate, endDate, calendar, timezone }) => {
    if (!startDate) {
        return null
    }

    if (!GREGORY_CALENDARS.includes(calendar)) {
        // TO DO: add support for non-gregory calendar
        return null
    }

    const end =
        endDate ?? getNowInCalendarString({ calendar, timezone, long: true })
    return moment(startDate).from(end)
}

export const isDateALessThanDateB = (
    dateA,
    dateB,
    { inclusive = false, calendar = 'gregory' } = {}
) => {
    if (!dateA || !dateB) {
        return false
    }
    // if the calendar is gregory, we can use JavaScript Date for comparison
    if (GREGORY_CALENDARS.includes(calendar)) {
        // if date is in format 'YYYY-MM-DD', when passed to JavaScript Date() it will give us 00:00 in UTC time (not client time)
        // dates with time information are interpreted in client time
        // we need the dates to be parsed in consistent time zone (i.e. client), so we add T00:00 to YYYY-MM-DD dates
        const dateAString = DATE_ONLY_REGEX.test(dateA)
            ? dateA + 'T00:00'
            : dateA
        const dateBString = DATE_ONLY_REGEX.test(dateB)
            ? dateB + 'T00:00'
            : dateB

        const dateADate = new Date(dateAString)
        const dateBDate = new Date(dateBString)

        // if dates are invalid, return null
        if (isNaN(dateADate)) {
            console.error(`Invalid date: ${dateA}`)
            return null
        }

        if (isNaN(dateBDate)) {
            console.error(`Invalid date: ${dateB}`)
            return null
        }

        if (inclusive) {
            return dateADate <= dateBDate
        } else {
            return dateADate < dateBDate
        }
    }

    // if calendar is not gregory, we try string comparison

    if (inclusive) {
        return dateA <= dateB
    }

    return dateA < dateB
}

// testing (a < b) is equivalent to testing (b > a), so we reuse the other function
export const isDateAGreaterThanDateB = (
    dateA,
    dateB,
    { inclusive = false, calendar = 'gregory' } = {}
) => {
    return isDateALessThanDateB(dateB, dateA, { inclusive, calendar })
}
