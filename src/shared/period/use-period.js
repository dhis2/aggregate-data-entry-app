import { createFixedPeriodFromPeriodId } from '@dhis2/multi-calendar-dates'
import { useMemo } from 'react'

export default function usePeriod(periodId) {
    // @TODO(calendar)
    const calendar = 'gregory'
    return useMemo(() => {
        if (!periodId) {
            return null
        }

        try {
            return createFixedPeriodFromPeriodId({ periodId, calendar })
        } catch (e) {
            return null
        }
    }, [periodId])
}
