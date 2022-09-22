import { useEffect, useState } from 'react'
import { selectors, useMetadata } from '../metadata/index.js'
import { useDataValueSet } from '../use-data-value-set/index.js'
import { CAN_HAVE_LIMITS_TYPES } from '../value-types.js'
import { useHighlightedFieldIdContext } from './use-highlighted-field-context.js'

function gatherHighlightedFieldData({ de, coc, dataValueSet, metadata }) {
    const dataValue = dataValueSet?.dataValues[de.id]?.[coc.id]
    const { optionSet, valueType, commentOptionSet } = de
    const canHaveLimits = optionSet
        ? false
        : CAN_HAVE_LIMITS_TYPES.includes(valueType)
    const isDefaultCategoryCombo = selectors.getCategoryComboById(
        metadata,
        de.categoryCombo?.id
    )?.isDefault

    if (dataValue) {
        return {
            ...dataValue,
            valueType,
            canHaveLimits,
            categoryOptionCombo: coc.id,
            categoryOptionComboName: isDefaultCategoryCombo
                ? ''
                : coc.displayName,
            name: de.displayName,
            code: de.code,
            commentOptionSetId: commentOptionSet?.id,
            description: de.description,
            displayFormName: de.displayFormName,
        }
    }

    return {
        valueType,
        canHaveLimits,
        categoryOptionCombo: coc.id,
        categoryOptionComboName: isDefaultCategoryCombo ? '' : coc.displayName,
        dataElement: de.id,
        name: de.displayName,
        lastUpdated: '',
        followup: false,
        comment: null,
        storedBy: null,
        code: null,
        commentOptionSetId: commentOptionSet?.id,
        description: de.description,
        displayFormName: de.displayFormName,
    }
}

export default function useHighlightedField() {
    const { data: dataValueSet } = useDataValueSet()
    const { data: metadata } = useMetadata()
    const { item } = useHighlightedFieldIdContext()
    const [currentItem, setHighlightedFieldId] = useState(() => {
        const { de, coc } = item
        return gatherHighlightedFieldData({ de, coc, dataValueSet, metadata })
    })

    useEffect(() => {
        const { de, coc } = item
        // only update if it's different from currentItem
        // prevents unnecessary re-render on first-render as well
        if (
            de.id !== currentItem?.dataElement ||
            coc.id !== currentItem?.categoryOptionCombo
        ) {
            setHighlightedFieldId(
                gatherHighlightedFieldData({ de, coc, dataValueSet, metadata })
            )
        }
    }, [currentItem, item, dataValueSet, metadata])

    return currentItem
}
