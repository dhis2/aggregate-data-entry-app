import { useContextSelection } from '../context-selection/index.js'
import { useMetadata } from '../metadata/index.js'
import { getDataSetById, getCategoryComboById } from '../metadata/selectors.js'

export const useAttributeParams = () => {
    const { data } = useMetadata()
    const [{ dataSetId, attributeOptionComboSelection }] = useContextSelection()

    if (data && dataSetId) {
        const dataSet = getDataSetById(data, dataSetId)
        const catComboId = dataSet.categoryCombo.id
        const categoryCombo = getCategoryComboById(data, catComboId)

        const selectedOptions = Object.values(attributeOptionComboSelection)
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
