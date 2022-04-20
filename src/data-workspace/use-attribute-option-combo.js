import { useMemo } from 'react'
import { useContextSelection } from '../context-selection/index.js'
import { useMetadata, useAttributeMetadata } from '../metadata/index.js'
import {
    getDataSetById,
    getCategoryComboById,
    findAoCByCategoryOptions,
} from '../metadata/selectors.js'

// TODO: this should probably be handled by useContextSelection-hook
// should not need this when api support CC and CP instead of cocId
export const useAttributeOptionCombo = () => {
    const { data } = useMetadata()
    const attributeMetadata = useAttributeMetadata()
    const [{ dataSetId, attributeOptionComboSelection }] = useContextSelection()

    const cocId = useMemo(() => {
        const hasData = data && attributeMetadata.data
        if (hasData && dataSetId) {
            const dataSet = getDataSetById(data, dataSetId)
            const categoryCombo = getCategoryComboById(
                data,
                dataSet.categoryCombo.id
            )
            console.log('seleced combo', categoryCombo)
            const attributeOptionCombos =
                attributeMetadata.data.categoryOptionCombos
            if (categoryCombo.isDefault) {
                // if default catCombo, selected should be default coc as well
                return categoryCombo.categoryOptionCombos[0].id
            }
            const selectedOptions = Object.values(attributeOptionComboSelection)

            const attributeOptionCombo = findAoCByCategoryOptions(
                attributeOptionCombos,
                dataSet.categoryCombo.id,
                selectedOptions
            )
            return attributeOptionCombo?.id
        }

        return null
    }, [dataSetId, attributeOptionComboSelection, data, attributeMetadata])

    return cocId
}

export const useAttributeParams = () => {
    const { data } = useMetadata()
    const [{ dataSetId, attributeOptionComboSelection }] = useContextSelection()

    const ret = {
        attributeCombo: undefined,
        attributeOptions: undefined,
        validSelection: false,
    }

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

    return ret
}
