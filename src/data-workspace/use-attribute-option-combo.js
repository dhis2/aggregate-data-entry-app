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
    const { isLoading, isError, data } = useMetadata()
    const [{ dataSetId, attributeOptionComboSelection }] = useContextSelection()

    const cocId = useMemo(() => {
        if (!isLoading && !isError && dataSetId) {
            const dataSet = getDataSetById(data, dataSetId)
            const categoryCombo = getCategoryComboById(
                data,
                dataSet.categoryCombo.id
            )
            if (categoryCombo.isDefault) {
                // if default catCombo, selected should be default coc as well
                return undefined // categoryCombo.categoryOptionCombos[0]
            }

            const selectedOptions = Object.values(attributeOptionComboSelection)

            const attributeOptionCombo = getCoCByCategoryOptions(
                data,
                dataSet.categoryCombo.id,
                selectedOptions
            )

            return attributeOptionCombo?.id
        }

        return null
    }, [dataSetId, attributeOptionComboSelection, data, isLoading, isError])

    return cocId
}
