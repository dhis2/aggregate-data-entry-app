import {
    convertFromIso8601,
    convertToIso8601,
} from '@dhis2/multi-calendar-dates'

const padWithZeros = (val, count) => String(val).padStart(count, '0')

export const convertFromIso8601ToString = (date, calendar) => {
    const { year, eraYear, month, day } = convertFromIso8601(date, calendar)
    const ISOyear = calendar === 'ethiopian' ? eraYear : year
    return `${padWithZeros(ISOyear, 4)}-${padWithZeros(
        month,
        2
    )}-${padWithZeros(day, 2)}`
}

export const convertToIso8601ToString = (date, calendar) => {
    const { year, month, day } = convertToIso8601(date, calendar)
    return `${padWithZeros(year, 4)}-${padWithZeros(month, 2)}-${padWithZeros(
        day,
        2
    )}`
}
