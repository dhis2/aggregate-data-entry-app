import PropTypes from 'prop-types'
import React, { useState } from 'react'
import { useCanUserEditFields } from '../use-user-info/index.js'
import { LockedContext } from './locked-info-context.js'
import { LockedStates } from './locked-states.js'

export function LockedProvider({ children }) {
    const userCanEditFields = useCanUserEditFields()
    const [lockStatus, setLockStatus] = useState(LockedStates.OPEN)

    const value = {
        // We treat fields that can't be edited for
        // authority reasons as locked fields
        locked: lockStatus !== LockedStates.OPEN || !userCanEditFields,
        lockStatus: !userCanEditFields
            ? LockedStates.LOCKED_NO_AUTHORITY
            : lockStatus,
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
