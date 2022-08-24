import { useEffect, useState } from 'react'
import { useMetadata, selectors } from '../metadata/index.js'
import { useDataValueSet } from '../use-data-value-set/index.js'
import { CAN_HAVE_LIMITS_TYPES } from '../value-types.js'
import { useHighlightedFieldIdContext } from './use-highlighted-field-context.js'

function gatherHighlightedFieldData({ de, cocId, dataValueSet }) {
    const dataValue = dataValueSet?.dataValues[de.id]?.[cocId]

    const { optionSet, valueType } = de
    const canHaveLimits = optionSet
        ? false
        : CAN_HAVE_LIMITS_TYPES.includes(valueType)

    if (dataValue) {
        return {
            ...dataValue,
            valueType,
            canHaveLimits,
            categoryOptionCombo: cocId,
            name: de.displayName,
            code: de.code,
        }
    }

    return {
        valueType,
        canHaveLimits,
        categoryOptionCombo: cocId,
        dataElement: de.id,
        name: de.displayName,
        lastUpdated: '',
        followup: false,
        comment: null,
        storedBy: null,
        code: de.code,
    }
}

export default function useHighlightedField() {
    const { data: dataValueSet } = useDataValueSet()
    const { item } = useHighlightedFieldIdContext()
    const { data: metadata } = useMetadata()
    const { deId, cocId } = item
    const de = selectors.getDataElementById(metadata, deId)

    const [currentItem, setHighlightedFieldId] = useState(() => {
        if (dataValueSet) {
            return gatherHighlightedFieldData({ de, cocId, dataValueSet })
        }

        return null
    })

    useEffect(() => {
        setHighlightedFieldId(
            gatherHighlightedFieldData({ de, cocId, dataValueSet })
        )
    }, [cocId, de, dataValueSet])

    return currentItem
}
