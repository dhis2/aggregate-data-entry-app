import { useMemo } from 'react'
import { parsePeriodId } from '../fixed-periods/index.js'

export default function usePeriod(periodId) {
    return useMemo(() => parsePeriodId(periodId), [periodId])
}
