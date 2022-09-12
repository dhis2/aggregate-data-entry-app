import { useValueStore, useHighlightedFieldStore } from '../../shared/index.js'
import { CAN_HAVE_LIMITS_TYPES } from '../value-types.js'

function gatherHighlightedFieldData({ item: { de, coc }, dataValue }) {
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
            description: de.description,
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
        description: de.description,
    }
}

export default function useHighlightedField() {
    const item = useHighlightedFieldStore((state) => state.item)

    const dataValue = useValueStore((state) =>
        state.getDataValue({
            dataElementId: item?.de?.id,
            categoryOptionComboId: item?.coc?.id,
        })
    )

    if (item) {
        return gatherHighlightedFieldData({ item, dataValue })
    }

    return null
}
