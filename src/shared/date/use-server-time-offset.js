import { useConfig } from '@dhis2/app-runtime'
import { useMemo } from 'react'
import { getCurrentDate } from '../fixed-periods/index.js'

export default function useServerTimeOffset() {
    const { systemInfo } = useConfig()
    const { serverTimeZoneId: timeZone } = systemInfo

    return useMemo(() => {
        const currentDate = getCurrentDate()
        const serverLocaleString = currentDate.toLocaleString('en-US', {
            timeZone,
        })
        const nowAtServerTimeZone = new Date(serverLocaleString)
        const currentDateTime = currentDate.getTime()
        const nowAtServerTimeZoneTime = nowAtServerTimeZone.getTime()
        return currentDateTime - nowAtServerTimeZoneTime
    }, [timeZone])
}
