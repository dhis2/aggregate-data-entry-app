import {
    addToCalendarDate,
    convertFromIso8601,
    convertToIso8601,
    formatCalendarDate,
} from '@dhis2/multi-calendar-dates'
import moment from 'moment'
import { getNowInCalendarString } from './get-now-in-calendar.js'

const GREGORY_CALENDARS = ['gregory', 'gregorian', 'iso8601'] // calendars that can be parsed by JS Date
const DATE_ONLY_REGEX = new RegExp(/^\d{4}-\d{2}-\d{2}$/)

// splits 'YYYY-MM-DD' or 'YYYY-MM-DDTHH:MM...' into the date and the time part
const splitDateString = (date) => ({
    dateString: date.substring(0, 10),
    timeString: date.substring(11),
})

const withTime = (dateString, timeString) =>
    timeString ? `${dateString}T${timeString}` : dateString

export const convertFromIso8601ToString = (date, calendar) => {
    // skip if there is no date
    if (!date) {
        return undefined
    }

    // return without conversion if already a gregory date
    if (GREGORY_CALENDARS.includes(calendar)) {
        return date
    }

    const { dateString, timeString } = splitDateString(date)
    const inCalendarDate = convertFromIso8601(dateString, calendar)

    return withTime(formatCalendarDate(inCalendarDate), timeString)
}

export const convertToIso8601ToString = (date, calendar) => {
    // skip if there is no date
    if (!date) {
        return undefined
    }

    // return without conversion if already a gregory date
    if (GREGORY_CALENDARS.includes(calendar)) {
        return date
    }

    const { dateString, timeString } = splitDateString(date)
    const isoDate = convertToIso8601(dateString, calendar)

    return withTime(formatCalendarDate(isoDate), timeString)
}

// adds days to a 'YYYY-MM-DD' or 'YYYY-MM-DDTHH:MM...' string in the given calendar
// the time part (if any) is kept as it is
export const addDaysToDateString = ({
    startDateString,
    days,
    calendar = 'gregory',
}) => {
    const { dateString, timeString } = splitDateString(startDateString)
    const [year, month, day] = dateString.split('-').map(Number)

    const endDate = addToCalendarDate({ year, month, day }, { days }, calendar)

    return withTime(formatCalendarDate(endDate), timeString)
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
