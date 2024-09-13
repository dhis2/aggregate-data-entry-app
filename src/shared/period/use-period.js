import { useConfig } from '@dhis2/app-runtime'
import { createFixedPeriodFromPeriodId } from '@dhis2/multi-calendar-dates'
import { useMemo } from 'react'

export default function usePeriod(periodId) {
    // @TODO(calendar)
    const { systemInfo = {} } = useConfig()
    const { keyUiLocale = 'en', calendar = 'gregory' } = systemInfo

    return useMemo(() => {
        if (!periodId) {
            return null
        }

        try {
            return createFixedPeriodFromPeriodId({
                periodId,
                calendar,
                locale: keyUiLocale,
            })
        } catch (e) {
            console.error(e)
            return null
        }
    }, [periodId, calendar, keyUiLocale])
}
