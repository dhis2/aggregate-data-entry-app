import { useCallback } from 'react'
import { useDataValuesWithSelector } from '../shared/index.js'

export const useMinMaxLimits = (dataElementId, categoryOptionComboId) => {
    const selector = useCallback(
        (data) =>
            data.minMaxValues?.find((minMaxValue) => {
                return (
                    minMaxValue.categoryOptionCombo === categoryOptionComboId &&
                    minMaxValue.dataElement === dataElementId
                )
            }),
        [dataElementId, categoryOptionComboId]
    )
    const limits = useDataValuesWithSelector(selector)

    return {
        min: limits?.minValue,
        max: limits?.maxValue,
    }
}
