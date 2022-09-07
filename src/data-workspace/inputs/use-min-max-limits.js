import { useDataValueSet } from '../../shared/index.js'

export const useMinMaxLimits = (dataElementId) => {
    const dataValueSet = useDataValueSet()

    const limits = dataValueSet.data.minMaxValues.find(
        (minMaxValue) => minMaxValue.dataElement === dataElementId
    )

    return (
        limits && {
            min: limits.minValue,
            max: limits.maxValue,
        }
    )
}
