import { useMemo } from 'react'
import { useValueStore } from '../shared/index.js'

export const useMinMaxLimits = (dataElementId, categoryOptionComboId) => {
    const limits = useValueStore((state) =>
        state.getMinMaxValues({ dataElementId, categoryOptionComboId })
    )

    return useMemo(
        () => ({
            min: limits?.minValue,
            max: limits?.maxValue,
        }),
        [limits]
    )
}
