import { useMemo } from 'react'
import {
    useValueStore,
    useHighlightedFieldStore,
    useMetadata,
    selectors,
} from '../../shared/index.js'
import { CAN_HAVE_LIMITS_TYPES } from '../value-types.js'

function gatherHighlightedFieldData({
    dataValue,
    dataElement,
    categoryCombo,
    categoryOptionComboId,
}) {
    const { optionSet, valueType, commentOptionSet } = dataElement
    const canHaveLimits = optionSet
        ? false
        : CAN_HAVE_LIMITS_TYPES.includes(valueType)

    const categoryOptionCombo = categoryCombo.categoryOptionCombos.find(
        (coc) => coc.id === categoryOptionComboId
    )

    const categoryOptionComboName = categoryCombo.isDefault
        ? ''
        : categoryOptionCombo.displayName
    if (dataValue) {
        return {
            ...dataValue,
            valueType,
            canHaveLimits,
            categoryOptionCombo: categoryOptionComboId,
            categoryOptionComboName: categoryOptionComboName,
            name: dataElement.displayName,
            code: dataElement.code,
            commentOptionSetId: commentOptionSet?.id,
            description: dataElement.description,
            displayFormName: dataElement.displayFormName,
        }
    }

    return {
        valueType,
        canHaveLimits,
        categoryOptionCombo: categoryOptionComboId,
        categoryOptionComboName: categoryOptionComboName,
        dataElement: dataElement.id,
        name: dataElement.displayName,
        lastUpdated: '',
        followup: false,
        comment: null,
        storedBy: null,
        code: null,
        commentOptionSetId: commentOptionSet?.id,
        description: dataElement.description,
        displayFormName: dataElement.displayFormName,
    }
}

export default function useHighlightedField() {
    const item = useHighlightedFieldStore((state) =>
        state.getHighlightedField()
    )
    const dataValue = useValueStore((state) =>
        state.getDataValue({
            dataElementId: item?.dataElementId,
            categoryOptionComboId: item?.categoryOptionComboId,
        })
    )
    const { data: metadata } = useMetadata()
    const dataElement = selectors.getDataElementById(
        metadata,
        item?.dataElementId
    )

    const categoryCombo = selectors.getCategoryOption(
        metadata,
        item?.categoryComboId
    )

    return useMemo(() => {
        if (!item || !dataElement) {
            return null
        }
        return gatherHighlightedFieldData({
            dataValue,
            dataElement,
            categoryCombo: categoryCombo,
            categoryOptionComboId: item.categoryOptionComboId,
        })
    }, [item, dataElement, dataValue, categoryCombo])
}
