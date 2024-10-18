import {
    convertFromIso8601,
    convertToIso8601,
} from '@dhis2/multi-calendar-dates'
import moment from 'moment'
import { getNowInCalendarString } from './get-now-in-calendar.js'

const GREGORY_CALENDARS = ['gregory', 'gregorian', 'iso8601'] // calendars that can be parsed by JS Date
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

export const convertFromIso8601ToString = (date, calendar) => {
    // return without conversion if already a gregory date
    if (GREGORY_CALENDARS.includes(calendar)) {
        return date
    }

    // separate the YYYY-MM-DD and time portions of the string
    const inCalendarDateString = date.substring(0, 10)
    const timeString = date.substring(11)

    const { year, eraYear, month, day } = convertFromIso8601(
        inCalendarDateString,
        calendar
    )
    const ISOyear = calendar === 'ethiopian' ? eraYear : year
    return `${padWithZeros(ISOyear, 4)}-${padWithZeros(
        month,
        2
    )}-${padWithZeros(day, 2)}${timeString ? 'T' + timeString : ''}`
}

export const convertToIso8601ToString = (date, calendar) => {
    // return without conversion if already a gregory date
    if (GREGORY_CALENDARS.includes(calendar)) {
        return date
    }

    // separate the YYYY-MM-DD and time portions of the string
    const inCalendarDateString = date.substring(0, 10)
    const timeString = date.substring(11)

    const { year, month, day } = convertToIso8601(
        inCalendarDateString,
        calendar
    )

    return `${padWithZeros(year, 4)}-${padWithZeros(month, 2)}-${padWithZeros(
        day,
        2
    )}${timeString ? 'T' + timeString : ''}`
}

// returns string in either 'YYYY-MM-DD' or 'YYYY-MM-DDTHH:MM.SSS' format (depending on input)
// if non-gregory calendar, returns null
// time zone will not be affected by browser conversion so long as initial date is not expressly UTC
export const addDaysToDateString = ({
    startDateString,
    days,
    calendar = 'gregory',
}) => {
    // convert date to gregory if necessary
    const startDateStringISO = convertToIso8601ToString(
        startDateString,
        calendar
    )

    // if the startDate does not have time stamp, then add it
    // adding T00:00 will prevent the date from being parsed in UTC time zone
    // (parsing as UTC relative to browser time zone can alter the date)
    const withoutTimeStamp = DATE_ONLY_REGEX.test(startDateStringISO)
    const adjustedStartDateString = withoutTimeStamp
        ? startDateStringISO + 'T00:00'
        : startDateStringISO

    const startDate = new Date(adjustedStartDateString)
    const endDate = new Date(startDate.getTime() + days * DAY_MS)

    // we remove the YYYY-MM-DD format if that was what was originally passed
    const formattedDate = formatDate(endDate, withoutTimeStamp)

    // reconvert from ISO if necessary
    return convertFromIso8601ToString(formattedDate, calendar)
}

// returns relative time between two dates
// if endDate is not provided, assumes end is now
export const getRelativeTime = ({ startDate, endDate, calendar, timezone }) => {
    if (!startDate) {
        return null
    }

    // convert dates to ISO if needed
    const nowISO = getNowInCalendarString({
        calendar: 'gregory',
        timezone,
        long: true,
    })
    const startISO = convertToIso8601ToString(startDate, calendar)
    const endISO = endDate
        ? convertToIso8601ToString(endDate, calendar)
        : nowISO

    return moment(startISO).from(endISO)
}

export const isDateALessThanDateB = (
    { date: dateA, calendar: calendarA = 'gregory' } = {},
    { date: dateB, calendar: calendarB = 'gregory' } = {},
    { inclusive = false } = {}
) => {
    if (!dateA || !dateB) {
        return false
    }
    // we first convert dates to ISO strings
    const dateAISO = convertToIso8601ToString(dateA, calendarA)
    const dateBISO = convertToIso8601ToString(dateB, calendarB)

    // if date is in format 'YYYY-MM-DD', when passed to JavaScript Date() it will give us 00:00 in UTC time (not client time)
    // dates with time information are interpreted in client time
    // we need the dates to be parsed in consistent time zone (i.e. client), so we add T00:00 to YYYY-MM-DD dates
    const dateAString = DATE_ONLY_REGEX.test(dateAISO)
        ? dateAISO + 'T00:00'
        : dateAISO
    const dateBString = DATE_ONLY_REGEX.test(dateBISO)
        ? dateBISO + 'T00:00'
        : dateBISO

    const dateADate = new Date(dateAString)
    const dateBDate = new Date(dateBString)

    // if dates are invalid, return null
    if (isNaN(dateADate)) {
        console.error(`Invalid date: ${dateA}`, dateAString, dateAISO)
        return null
    }

    if (isNaN(dateBDate)) {
        console.error(`Invalid date: ${dateB}`, dateBString, dateBISO)
        return null
    }

    if (inclusive) {
        return dateADate <= dateBDate
    } else {
        return dateADate < dateBDate
    }
}

// testing (a < b) is equivalent to testing (b > a), so we reuse the other function
export const isDateAGreaterThanDateB = (
    dateA,
    dateB,
    { inclusive = false } = {}
) => {
    return isDateALessThanDateB(dateB, dateA, { inclusive })
}
