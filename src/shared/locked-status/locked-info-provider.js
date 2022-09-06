import PropTypes from 'prop-types'
import React, { useState } from 'react'
import { LockedContext } from './locked-info-context.js'
import { LockedStates } from './locked-states.js'

export function LockedProvider({ children }) {
    const [lockedItems, setLockedStatus] = useState({})

    const value = {
        ...LockedStates.OPEN,
        ...lockedItems,
        setLockedStatus,
    }

    return (
        <LockedContext.Provider value={value}>
            {children}
        </LockedContext.Provider>
    )
}

LockedProvider.propTypes = {
    children: PropTypes.any.isRequired,
}
