import { useMetadata, selectors } from './metadata/index.js'
import { useContextSelection } from './use-context-selection/index.js'

/**
 * Finds the attributeComboId for the current attribute-option selection.
 * Returns { attributeCombo: undefined, attributeOptions: undefined }
 * if the current data set uses the `default` attribute combo
 */

export const useApiAttributeParams = () => {
    const { data } = useMetadata()
    const [{ dataSetId, attributeOptionComboSelection }] = useContextSelection()

    if (data && dataSetId) {
        const dataSet = selectors.getDataSetById(data, dataSetId)
        const catComboId = dataSet.categoryCombo.id
        const categoryCombo = selectors.getCategoryComboById(data, catComboId)

        // Sort these to produce consistent query and mutation keys
        const selectedOptions = Object.values(
            attributeOptionComboSelection
        ).sort()

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
