import { useConfig } from '@dhis2/app-runtime'
import { useMemo } from 'react'
import { getCurrentDate } from '../fixed-periods/index.js'

export default function useServerTimeOffset() {
    const { systemInfo } = useConfig()
    const { serverTimeZoneId: timeZone } = systemInfo

    return useMemo(() => {
        const currentDate = getCurrentDate()
        let serverLocaleString
        try {
            serverLocaleString = currentDate.toLocaleString('sv', {
                timeZone,
            })
        } catch (e) {
            console.error(e)
            console.info('Assuming no server/client time zone difference')
            serverLocaleString = currentDate.toLocaleString('sv')
        }

        const nowAtServerTimeZone = new Date(serverLocaleString)
        const currentDateTime = currentDate.getTime()
        const nowAtServerTimeZoneTime = nowAtServerTimeZone.getTime()
        return currentDateTime - nowAtServerTimeZoneTime
    }, [timeZone])
}
