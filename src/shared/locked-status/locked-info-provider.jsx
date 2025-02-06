import PropTypes from 'prop-types'
import React, { useState, useMemo } from 'react'
import { useCanUserEditFields } from '../use-user-info/index.js'
import { LockedContext } from './locked-info-context.js'
import { LockedStates } from './locked-states.js'

export function LockedProvider({ children }) {
    const userCanEditFields = useCanUserEditFields()
    const [{ state, lockDate }, setLockStatus] = useState({
        state: LockedStates.OPEN,
        lockDate: null,
    })

    const value = useMemo(
        () => ({
            // We treat fields that can't be edited for
            // authority reasons as locked fields
            locked: state !== LockedStates.OPEN || !userCanEditFields,
            lockStatus: {
                state: !userCanEditFields
                    ? LockedStates.LOCKED_NO_AUTHORITY
                    : state,
                lockDate: lockDate || null,
            },
            setLockStatus,
        }),
        [state, lockDate, userCanEditFields]
    )

    return (
        <LockedContext.Provider value={value}>
            {children}
        </LockedContext.Provider>
    )
}

LockedProvider.propTypes = {
    children: PropTypes.any.isRequired,
}
