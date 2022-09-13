import { useConfig } from '@dhis2/app-runtime'

export const useServerDateTimeAsLocal = (dateTime) => {
    const { systemInfo } = useConfig()

    if (!dateTime) {
        return undefined
    }

    const localNow = new Date()
    localNow.setMilliseconds(0)
    const nowAtServerTimeZone = new Date(
        localNow.toLocaleString('en-US', {
            timeZone: systemInfo.serverTimeZoneId,
        })
    )
    const timestamp = new Date(dateTime).getTime()
    const timeOffset = localNow.getTime() - nowAtServerTimeZone.getTime()

    return new Date(timestamp + timeOffset)
}
