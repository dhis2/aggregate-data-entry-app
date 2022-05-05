import { useMetadata, selectors } from '../../metadata/index.js'
import { useContextSelection } from '../use-context-selection/index.js'

export function useIsValidSelection() {
    const [{ dataSetId, orgUnitId, periodId, attributeOptionComboSelection }] =
        useContextSelection()
    const { data } = useMetadata()

    let validAttributeComboSelection = false
    if (data && dataSetId) {
        const dataSet = selectors.getDataSetById(data, dataSetId)
        const catComboId = dataSet.categoryCombo.id
        const categoryCombo = selectors.getCategoryComboById(data, catComboId)

        const selectedOptions = Object.values(attributeOptionComboSelection)

        // if default catCombo, no selection is needed
        if (categoryCombo.isDefault) {
            validAttributeComboSelection = true
        } else {
            validAttributeComboSelection =
                categoryCombo.categories.length === selectedOptions.length
        }
    }

    if (orgUnitId && periodId && validAttributeComboSelection) {
        return true
    }

    return false
}
