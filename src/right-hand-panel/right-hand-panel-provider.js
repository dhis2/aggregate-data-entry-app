import PropTypes from 'prop-types'
import React, { useState } from 'react'
import RightHandPanelContext from './right-hand-panel-context.js'

export default function RightHandPanelProvider({ children }) {
    const [id, setId] = useState('')

    const value = {
        id,
        show: setId,
        hide: () => setId(''),
    }

    return (
        <RightHandPanelContext.Provider value={value}>
            {children}
        </RightHandPanelContext.Provider>
    )
}

RightHandPanelProvider.propTypes = {
    children: PropTypes.any.isRequired,
}
