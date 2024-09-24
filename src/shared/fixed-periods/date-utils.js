import moment from 'moment'
import { getNowInCalendarString } from './get-now-in-calendar.js'

const DAY_MS = 24 * 60 * 60 * 1000
const DATE_ONLY_REGEX = new RegExp(/^\d{4}-\d{2}-\d{2}$/)

const formatDate = (date, withoutTimeStamp) => {
    const year = date.getFullYear()
    const month = date.getMonth() + 1 // Jan = 0
    const day = date.getDay()
    const hours = date.getHours()
    const minutes = date.getMinutes()
    const seconds = date.getSeconds()

    if (withoutTimeStamp) {
        return `${year}-${month}-${day}`
    }
    return `${year}-${month}-${day}T${hours}:${minutes}.${seconds}`
}

// returns string in either 'YYYY-MM-DD' or 'YYYY-MM-DDTHH:MM.SSS' format (depending on input)
// if non-gregory calendar, returns null
// time zone will not be affected by browser conversion so long as initial date is not expressly UTC
export const addDaysToDateString = ({
    startDateString,
    days,
    calendar = 'gregory',
}) => {
    if (calendar !== 'gregory') {
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

    if (calendar !== 'gregory') {
        // TO DO: add support for non-gregory calendar
        return null
    }

    const end = endDate ?? getNowInCalendarString({ calendar, timezone })

    return moment(startDate).from(end)
}
