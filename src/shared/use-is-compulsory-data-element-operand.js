import { useMemo } from 'react'
import { useMetadata, selectors } from './metadata/index.js'
import { useDataSetId } from './use-context-selection/use-context-selection.js'
import { useDataValueSet } from './use-data-value-set/use-data-value-set.js'

export const useIsCompulsoryDataElementOperand = ({
    dataElementId,
    categoryOptionComboId,
}) => {
    const { data: metadata } = useMetadata()
    const [dataSetId] = useDataSetId()
    if (!dataSetId) {
        return false
    }
    const compulsoryDataElementOperandsSet =
        selectors.getCompulsoryDataElementOperandsSet(metadata, dataSetId)
    return compulsoryDataElementOperandsSet.has(
        `${dataElementId}.${categoryOptionComboId}`
    )
}

export const useHasCompulsoryDataElementOperandsToFillOut = () => {
    const { data } = useDataValueSet()

    const { data: metadata } = useMetadata()
    const [dataSetId] = useDataSetId()
    const hasCompulsoryDataElementOperandsToFillOut = useMemo(() => {
        if (!dataSetId) {
            return false
        }
        const dataSet = selectors.getDataSetById(metadata, dataSetId)

        const { compulsoryFieldsCompleteOnly } = dataSet || {}

        if (!compulsoryFieldsCompleteOnly) {
            return false
        }

        const compulsoryDataElementOperandsSet =
            selectors.getCompulsoryDataElementOperandsSet(metadata, dataSetId)

        let hasEmptyCompulsoryDataElementOperands = false
        for (const operand of compulsoryDataElementOperandsSet) {
            const [dataElementId, categoryOptionComboId] = operand.split('.')
            if (
                !data?.dataValues?.[dataElementId]?.[categoryOptionComboId]
                    ?.value
            ) {
                hasEmptyCompulsoryDataElementOperands = true
                break
            }
        }
        return hasEmptyCompulsoryDataElementOperands
    }, [data?.dataValues, dataSetId, metadata])

    return hasCompulsoryDataElementOperandsToFillOut
}
