import { useContextSelection } from '../context-selection/use-context-selection/index.js'
import { useMetadata, selectors } from '../metadata/index.js'

/**
 * Finds the attributeComboId for the current attribute-option selection
 */

export const useApiAttributeParams = () => {
    const { data } = useMetadata()
    const [{ dataSetId, attributeOptionComboSelection }] = useContextSelection()

    if (data && dataSetId) {
        const dataSet = selectors.getDataSetById(data, dataSetId)
        const catComboId = dataSet.categoryCombo.id
        const categoryCombo = selectors.getCategoryComboById(data, catComboId)

        const selectedOptions = Object.values(attributeOptionComboSelection)

        if (!categoryCombo.isDefault) {
            // we don't need to supply attributeCombo/options when it's default
            return {
                attributeCombo: catComboId,
                attributeOptions: selectedOptions,
            }
        }
    }

    return {
        attributeCombo: undefined,
        attributeOptions: undefined,
    }
}
