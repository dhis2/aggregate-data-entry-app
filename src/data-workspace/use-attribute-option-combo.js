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
    const { isLoading, isError, data } = useMetadata()
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
    }, [
        dataSetId,
        attributeOptionComboSelection,
        data,
        isLoading,
        isError,
        attributeMetadata,
    ])

    return cocId
}
