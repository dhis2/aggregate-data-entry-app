import PropTypes from 'prop-types'
import React, { useState } from 'react'
import {
    HighlightedFieldIdContext,
    SetHighlightedFieldIdContext,
} from './highlighted-field-context.js'

export default function HighlightedFieldIdProvider({ children }) {
    const [item, setItem] = useState(null)
    const value = { item, setItem }

    return (
        <HighlightedFieldIdContext.Provider value={value}>
            <SetHighlightedFieldIdContext.Provider value={setItem}>
                {children}
            </SetHighlightedFieldIdContext.Provider>
        </HighlightedFieldIdContext.Provider>
    )
}

HighlightedFieldIdProvider.propTypes = {
    children: PropTypes.any,
}
