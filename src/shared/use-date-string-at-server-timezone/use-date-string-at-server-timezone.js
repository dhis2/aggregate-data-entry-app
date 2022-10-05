import { useConfig } from '@dhis2/app-runtime'
import { getCurrentDate } from '../fixed-periods/index.js'

const getLocalDateString = (date) => {
    const yyyy = date.getFullYear()
    const mm = String(date.getMonth() + 1).padStart(2, '0')
    const dd = String(date.getDate()).padStart(2, '0')

    return `${yyyy}-${mm}-${dd}`
}

const useDateStringAtServerTimezone = (date = getCurrentDate()) => {
    const { systemInfo } = useConfig()
    const nowAtServerTimeZone = new Date(
        date.toLocaleString('en-US', {
            timeZone: systemInfo.serverTimeZoneId,
        })
    )
    const timeOffset = nowAtServerTimeZone.getTime() - date.getTime()
    const adjustedDate = new Date(date.getTime() + timeOffset)

    return getLocalDateString(adjustedDate)
}

export default useDateStringAtServerTimezone
