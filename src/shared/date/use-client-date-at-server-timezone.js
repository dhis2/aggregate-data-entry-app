import { useConfig } from '@dhis2/app-runtime'
import { getCurrentDate } from '../fixed-periods/index.js'

export default function useClientDateAtServerTimezone(date) {
    const currentDate = getCurrentDate()
    const { systemInfo } = useConfig()
    const nowAtServerTimeZone = new Date(
        currentDate.toLocaleString('en-US', {
            timeZone: systemInfo.serverTimeZoneId,
        })
    )

    const currentDateTime = currentDate.getTime()
    const nowAtServerTimeZoneTime = nowAtServerTimeZone.getTime()
    const timeOffset = nowAtServerTimeZoneTime - currentDateTime
    const dateTime = date.getTime()

    return new Date(dateTime + timeOffset)
}
