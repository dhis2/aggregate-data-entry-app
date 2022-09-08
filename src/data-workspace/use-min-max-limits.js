import { useDataValueSet, useOrgUnitId } from '../shared/index.js'

export const useMinMaxLimits = (dataElementId, categoryOptionComboId) => {
    const [orgUnitId] = useOrgUnitId()
    const dataValueSet = useDataValueSet()

    const limits = dataValueSet.data?.minMaxValues.find((minMaxValue) => {
        return (
            minMaxValue.categoryOptionCombo === categoryOptionComboId &&
            minMaxValue.dataElement === dataElementId &&
            minMaxValue.orgUnit === orgUnitId
        )
    })

    return {
        min: limits?.minValue,
        max: limits?.maxValue,
    }
}
