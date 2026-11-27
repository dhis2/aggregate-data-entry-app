import { useShowsAllAttributeOptions } from '../embedded/index.js'
import { useMetadata, selectors } from '../metadata/index.js'
import { useContextSelection } from './use-context-selection.js'

export function useIsValidSelection() {
    const [{ dataSetId, orgUnitId, periodId, attributeOptionComboSelection }] =
        useContextSelection()
    const { data } = useMetadata()
    const showsAllAttributeOptions = useShowsAllAttributeOptions()

    if (!data || !dataSetId || !orgUnitId || !periodId) {
        return false
    }

    const dataSet = selectors.getDataSetById(data, dataSetId)
    const catComboId = dataSet?.categoryCombo?.id
    const categoryCombo = selectors.getCategoryComboById(data, catComboId)
    if (
        dataSet === undefined ||
        categoryCombo === null ||
        categoryCombo === undefined
    ) {
        return false
    }

    const selectedOptions = Object.values(attributeOptionComboSelection)

    // if default catCombo, or all attribute options are shown together, no
    // selection is needed
    if (categoryCombo?.isDefault || showsAllAttributeOptions) {
        return true
    }

    return categoryCombo.categories.length === selectedOptions.length
}
