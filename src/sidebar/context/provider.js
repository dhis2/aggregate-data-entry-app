import PropTypes from 'prop-types'
import React, { useState } from 'react'
import SidebarContext from './context.js'

const SidebarProvider = ({ children }) => {
    const [contentType, setContentType] = useState(null)

    const value = {
        showContextualHelp: () => {
            setContentType('CONTEXTUAL_HELP')
        },
        showDataDetails: () => {
            setContentType('DATA_DETAILS')
        },
        visible: !!contentType,
        close: () => {
            setContentType(null)
        },
        contentType,
    }

    return (
        <SidebarContext.Provider value={value}>
            {children}
        </SidebarContext.Provider>
    )
}

SidebarProvider.propTypes = {
    children: PropTypes.node.isRequired,
}

export default SidebarProvider
