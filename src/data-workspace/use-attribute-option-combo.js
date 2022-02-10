import { useMemo } from 'react'
import { useContextSelection } from '../context-selection/index.js'
import { useMetadata } from '../metadata/index.js'
import {
    getCoCByCategoryOptions,
    getDataSetById,
    getCategoryComboById,
} from '../metadata/selectors.js'

// TODO: this should probably be handled by useContextSelection-hook
// should not need this when api support CC and CP instead of cocId
export const useAttributeOptionCombo = () => {
    const { available, metadata } = useMetadata()
    const [{ dataSetId, attributeOptionComboSelection }] = useContextSelection()
    const cocId = useMemo(() => {
        if (available && dataSetId) {
            const dataSet = getDataSetById(metadata, dataSetId)
            const categoryCombo = getCategoryComboById(
                metadata,
                dataSet.categoryCombo.id
            )
            if (categoryCombo.isDefault) {
                // if default catCombo, selected should be default coc as well
                return categoryCombo.categoryOptionCombos[0]
            }

            const selectedOptions = Object.values(attributeOptionComboSelection)

            const attributeOptionCombo = getCoCByCategoryOptions(
                metadata,
                dataSet.categoryCombo.id,
                selectedOptions
            )

            return attributeOptionCombo?.id
        }
        return null
    }, [dataSetId, attributeOptionComboSelection, metadata, available])

    return cocId
}
