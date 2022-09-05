import { useEffect, useState } from 'react'
import { useDataValueSet } from '../use-data-value-set/index.js'
import { CAN_HAVE_LIMITS_TYPES } from '../value-types.js'
import { useHighlightedFieldIdContext } from './use-highlighted-field-context.js'

function gatherHighlightedFieldData({ de, coc, dataValueSet }) {
    const dataValue = dataValueSet?.dataValues[de.id]?.[coc.id]
    const { optionSet, valueType, commentOptionSet } = de
    const canHaveLimits = optionSet
        ? false
        : CAN_HAVE_LIMITS_TYPES.includes(valueType)

    if (dataValue) {
        return {
            ...dataValue,
            valueType,
            canHaveLimits,
            categoryOptionCombo: coc.id,
            name: de.displayName,
            code: de.code,
            commentOptionSetId: commentOptionSet?.id,
        }
    }

    return {
        valueType,
        canHaveLimits,
        categoryOptionCombo: coc.id,
        dataElement: de.id,
        name: de.displayName,
        lastUpdated: '',
        followup: false,
        comment: null,
        storedBy: null,
        code: null,
        commentOptionSetId: commentOptionSet?.id,
    }
}

export default function useHighlightedField() {
    const { data: dataValueSet } = useDataValueSet()
    const { item } = useHighlightedFieldIdContext()
    const [currentItem, setHighlightedFieldId] = useState(() => {
        if (dataValueSet) {
            const { de, coc } = item
            return gatherHighlightedFieldData({ de, coc, dataValueSet })
        }

        return null
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
                gatherHighlightedFieldData({ de, coc, dataValueSet })
            )
        }
    }, [currentItem, item, dataValueSet])

    return currentItem
}
