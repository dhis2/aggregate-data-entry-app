import PropTypes from 'prop-types'
import React, { useState } from 'react'
import CurrentItemContext from './current-item-context.js'

export default function CurrentItemProvider({ children }) {
    const [item, setItem] = useState(null)
    const value = { item, setItem }

    return (
        <CurrentItemContext.Provider value={value}>
            {children}
        </CurrentItemContext.Provider>
    )
}

CurrentItemProvider.propTypes = {
    children: PropTypes.any,
}
