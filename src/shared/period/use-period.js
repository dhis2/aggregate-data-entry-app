import { useConfig } from '@dhis2/app-runtime'
import { createFixedPeriodFromPeriodId } from '@dhis2/multi-calendar-dates'
import { useMemo } from 'react'
import { useUserInfo } from '../use-user-info/index.js'

export default function usePeriod(periodId) {
    const { systemInfo = {} } = useConfig()
    const { calendar = 'gregory' } = systemInfo
    const { data: userInfo } = useUserInfo()
    const { keyUiLocale: locale } = userInfo.settings ?? {}

    return useMemo(() => {
        if (!periodId) {
            return null
        }

        try {
            return createFixedPeriodFromPeriodId({
                periodId,
                calendar,
                locale,
            })
        } catch (e) {
            console.error(e)
            return null
        }
    }, [periodId, calendar, locale])
}
