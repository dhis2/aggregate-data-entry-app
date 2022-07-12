import { useEffect, useState } from 'react'
import { useDataValueSet } from '../use-data-value-set/index.js'
import { useHighlightedFieldIdContext } from './use-highlighted-field-context.js'

function gatherHighlightedFieldData({ de, coc, dataValueSet }) {
    const dataValue = dataValueSet?.dataValues[de.id]?.[coc.id]

    if (dataValue) {
        return {
            ...dataValue,
            categoryOptionCombo: coc.id,
            name: de.displayName,
            code: de.code,
        }
    }

    return {
        categoryOptionCombo: coc.id,
        dataElement: de.id,
        name: de.displayName,
        lastUpdated: '',
        followup: false,
        comment: null,
        storedBy: null,
        code: null,
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
        setHighlightedFieldId(
            gatherHighlightedFieldData({ de, coc, dataValueSet })
        )
    }, [item, dataValueSet])

    return currentItem
}
