import PropTypes from 'prop-types'
import React, { useState, useRef, useMemo, useCallback, useEffect } from 'react'
import {
    HighlightedFieldIdContext,
    SetHighlightedFieldIdContext,
} from './highlighted-field-context.js'

export default function HighlightedFieldIdProvider({ children }) {
    const [item, setItem] = useState(null)
    const previousHighlightedFieldId = useRef()

    const setHighlightedItem = useCallback(
        (newItem) => {
            previousHighlightedFieldId.current = item
            setItem(newItem)
        },
        [item]
    )

    const value = {
        item,
        previousHighlightedFieldId: previousHighlightedFieldId?.current,
    }

    return (
        <HighlightedFieldIdContext.Provider value={value}>
            <SetHighlightedFieldIdContext.Provider value={setHighlightedItem}>
                {children}
            </SetHighlightedFieldIdContext.Provider>
        </HighlightedFieldIdContext.Provider>
    )
}

HighlightedFieldIdProvider.propTypes = {
    children: PropTypes.any,
}
