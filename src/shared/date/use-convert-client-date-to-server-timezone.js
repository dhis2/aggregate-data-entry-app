import { useConfig } from '@dhis2/app-runtime'
import { useCallback } from 'react'
import { getCurrentDate } from '../fixed-periods/index.js'

export default function useConvertClientDateAtServerTimezone() {
    const currentDate = getCurrentDate()
    const { systemInfo } = useConfig()
    const nowAtServerTimeZone = new Date(
        currentDate.toLocaleString('en-US', {
            timeZone: systemInfo.serverTimeZoneId,
        })
    )

    const currentDateTime = currentDate.getTime()
    const nowAtServerTimeZoneTime = nowAtServerTimeZone.getTime()

    // The milliseconds are not stable, producing a different "timeOffset" at
    // each re-render.
    const timeOffset = Math.floor((nowAtServerTimeZoneTime - currentDateTime) / 1000) * 1000

    return useCallback(function convertClientDateAtServerTimezone(date) {
        const dateTime = date.getTime()
        return new Date(dateTime + timeOffset)
    }, [timeOffset])
}
