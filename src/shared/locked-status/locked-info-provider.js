import PropTypes from 'prop-types'
import React, { useState } from 'react'
import { LockedContext } from './locked-info-context.js'
import { LockedStates } from './locked-states.js'

export function LockedProvider({ children }) {
    const [lockStatus, setLockStatus] = useState(LockedStates.OPEN)

    const value = {
        lockStatus,
        locked: lockStatus !== LockedStates.OPEN,
        setLockStatus,
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
