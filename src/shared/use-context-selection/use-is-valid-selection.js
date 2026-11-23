import { useHostDataValues } from '../embedded/index.js'
import { useMetadata, selectors } from '../metadata/index.js'
import { useContextSelection } from './use-context-selection.js'

export function useIsValidSelection() {
    const [{ dataSetId, orgUnitId, periodId, attributeOptionComboSelection }] =
        useContextSelection()
    const { data } = useMetadata()
    const hostDataValues = useHostDataValues()

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

    // if default catCombo, no selection is needed. Values from an embedding
    // app don't need one either: they can add up all attribute options
    if (categoryCombo?.isDefault || hostDataValues) {
        return true
    }

    return categoryCombo.categories.length === selectedOptions.length
}
