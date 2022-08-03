import PropTypes from 'prop-types'
import React, { useState } from 'react'
import FormChangedSincePanelOpenedContext from './form-changed-since-panel-opened-context.js'

export default function RightHandPanelProvider({ children }) {
    const [formChangedSincePanelOpened, setFormChangedSincePanelOpened] =
        useState(false)

    const value = {
        formChangedSincePanelOpened,
        setFormChangedSincePanelOpened,
    }

    return (
        <FormChangedSincePanelOpenedContext.Provider value={value}>
            {children}
        </FormChangedSincePanelOpenedContext.Provider>
    )
}

RightHandPanelProvider.propTypes = {
    children: PropTypes.any.isRequired,
}
