import { useMetadata, selectors } from '../../metadata/index.js'
import { useContextSelection } from '../use-context-selection/index.js'

/**
 * Finds the attributeComboId for the current attribute-option selection
 */

export const useAttributeParams = () => {
    const { data } = useMetadata()
    const [{ dataSetId, attributeOptionComboSelection }] = useContextSelection()

    if (data && dataSetId) {
        const dataSet = selectors.getDataSetById(data, dataSetId)
        const catComboId = dataSet.categoryCombo.id
        const categoryCombo = selectors.getCategoryComboById(data, catComboId)

        const selectedOptions = Object.values(attributeOptionComboSelection)

        if (categoryCombo.isDefault) {
            // we don't need to supply attributeCombo/options when it's default
            return {
                validSelection: true,
            }
        }
        // all categories in catCombo should have a selection
        const validSelection =
            categoryCombo.categories.length === selectedOptions.length
        return {
            attributeCombo: catComboId,
            attributeOptions: selectedOptions,
            validSelection,
        }
    }

    return {
        attributeCombo: undefined,
        attributeOptions: undefined,
        validSelection: false,
    }
}
