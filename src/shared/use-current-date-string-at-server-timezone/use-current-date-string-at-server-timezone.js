import { useConfig } from '@dhis2/app-runtime'
import { getCurrentDate } from '../fixed-periods/index.js'

const getLocalDateString = (date) => {
    console.log(date, typeof date, date instanceof Date)
    const yyyy = date.getFullYear()
    const mm = String(date.getMonth() + 1).padStart(2, '0')
    const dd = String(date.getDate()).padStart(2, '0')

    return `${yyyy}-${mm}-${dd}`
}

export const useCurrentDateStringAtServerTimezone = () => {
    const { systemInfo } = useConfig()
    const localNow = getCurrentDate()
    const nowAtServerTimeZone = new Date(
        localNow.toLocaleString('en-US', {
            timeZone: systemInfo.serverTimeZoneId,
        })
    )
    const timeOffset = nowAtServerTimeZone.getTime() - localNow.getTime()
    const adjustedDate = new Date(localNow.getTime() + timeOffset)

    return getLocalDateString(adjustedDate)
}
