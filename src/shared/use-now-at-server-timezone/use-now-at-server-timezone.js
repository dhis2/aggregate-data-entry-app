import { useConfig } from '@dhis2/app-runtime'
import { getCurrentDate } from '../fixed-periods/index.js'

export const useNowAtServerTimezone = () => {
    const { systemInfo } = useConfig()
    const localNow = getCurrentDate()
    const nowAtServerTimeZone = new Date(
        localNow.toLocaleString('en-US', {
            timeZone: systemInfo.serverTimeZoneId,
        })
    )
    const timeOffset = nowAtServerTimeZone.getTime() - localNow.getTime()

    return new Date(localNow.getTime() + timeOffset)
}
