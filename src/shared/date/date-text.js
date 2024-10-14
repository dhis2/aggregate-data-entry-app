import { useConfig, useTimeZoneConversion } from '@dhis2/app-runtime'
import PropTypes from 'prop-types'
import React from 'react'
import { convertFromIso8601ToString } from './date-utils.js'

const formatDate = ({
    dateString,
    dateFormat = 'yyyy-mm-dd',
    includeTimeZone = false,
}) => {
    if (!dateString) {
        return ''
    }
    // the returned date includes seconds/ms and we want to simplify to just show date and HH:MM
    const year = dateString.substring(0, 4)
    const month = dateString.substring(5, 7)
    const day = dateString.substring(8, 10)
    const minutes = dateString.substring(11, 13)
    const seconds = dateString.substring(14, 16)

    const timeZone = Intl.DateTimeFormat()?.resolvedOptions()?.timeZone

    if (dateFormat.toLowerCase() === 'dd-mm-yyyy') {
        return `${day}-${month}-${year} ${minutes}:${seconds} ${
            includeTimeZone && timeZone ? '(' + timeZone + ')' : ''
        }`
    }
    return `${year}-${month}-${day} ${minutes}:${seconds} ${
        includeTimeZone && timeZone ? '(' + timeZone + ')' : ''
    }`
}

export const DateText = ({ date, includeTimeZone }) => {
    const { systemInfo = {} } = useConfig()
    const { calendar = 'gregory', dateFormat } = systemInfo
    const { fromServerDate } = useTimeZoneConversion()

    // NOTE: the passed date is assumed to be in ISO

    // we first correct for time zone
    const dateClient = fromServerDate(date)

    // then we convert to the system calendar (we pass the client time zone equivalent of the date)
    const inSystemCalendarDateString = convertFromIso8601ToString(
        dateClient.getClientZonedISOString(),
        calendar
    )

    // we put it in the system setting for the date display

    return (
        <p>
            {formatDate({
                dateString: inSystemCalendarDateString,
                dateFormat,
                includeTimeZone,
            })}
        </p>
    )
}

DateText.propTypes = {
    date: PropTypes.string,
    includeTimeZone: PropTypes.bool,
}
