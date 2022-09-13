import { getCurrentDate } from '../fixed-periods/index.js'
import { useServerDateTimeAsLocal } from './use-server-date-time-as-local.js'

export const useNowAtServerTimezone = () => {
    const localNow = getCurrentDate()
    localNow.setMilliseconds(0)

    return useServerDateTimeAsLocal(localNow.toUTCString())
}
