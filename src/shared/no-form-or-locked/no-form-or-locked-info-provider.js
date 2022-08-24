import PropTypes from 'prop-types'
import React, { useState } from 'react'
import { noFormOrLockedStates } from './no-form-and-locked-states.js'
import { NoFormOrLockedContext } from './no-form-or-locked-info-context.js'

export function NoFormOrLockedProvider({ children }) {
    const [noFormOrLockedItems, setNoFormOrLockedStatus] = useState({})

    const value = {
        ...noFormOrLockedStates.OPEN,
        ...noFormOrLockedItems,
        setNoFormOrLockedStatus,
    }

    return (
        <NoFormOrLockedContext.Provider value={value}>
            {children}
        </NoFormOrLockedContext.Provider>
    )
}

NoFormOrLockedProvider.propTypes = {
    children: PropTypes.any.isRequired,
}
