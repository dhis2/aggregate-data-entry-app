import { useMemo } from 'react'
import {
    useValueStore,
    useHighlightedFieldStore,
    useMetadata,
    selectors,
} from '../../shared/index.js'
import { CAN_HAVE_LIMITS_TYPES } from '../value-types.js'

function gatherHighlightedFieldData({
    metadata,
    dataValue,
    dataElement,
    categoryOptionComboId,
}) {
    const { optionSet, valueType, commentOptionSet } = dataElement
    const canHaveLimits = optionSet
        ? false
        : CAN_HAVE_LIMITS_TYPES.includes(valueType)
    const categoryCombo = selectors.getCategoryComboById(
        metadata,
        dataElement.categoryCombo.id
    )
    const categoryOptionCombo = selectors.getCategoryOptionCombo(
        metadata,
        categoryCombo.id,
        categoryOptionComboId
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

    return useMemo(() => {
        if (!item || !dataElement) {
            return null
        }

        return gatherHighlightedFieldData({
            metadata,
            dataValue,
            dataElement,
            categoryOptionComboId: item.categoryOptionComboId,
        })
    }, [item, dataElement, dataValue, metadata])
}
