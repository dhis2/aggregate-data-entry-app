import PropTypes from 'prop-types'
import React, { useCallback, useState } from 'react'
import {
    RightHandPanelContext,
    SetRightHandPanelContext,
} from './right-hand-panel-context.js'

export default function RightHandPanelProvider({ children }) {
    const [id, setId] = useState('')
    const [formChangedSincePanelOpened, setFormChangedSincePanelOpened] =
        useState(false)
    const show = setId
    const hide = useCallback(() => {
        setId('')
        setFormChangedSincePanelOpened(false)
    }, [setId])

    const value = {
        id,
        show,
        hide,
        formChangedSincePanelOpened,
        setFormChangedSincePanelOpened,
    }

    return (
        <RightHandPanelContext.Provider value={value}>
            <SetRightHandPanelContext.Provider value={show}>
                {children}
            </SetRightHandPanelContext.Provider>
        </RightHandPanelContext.Provider>
    )
}

RightHandPanelProvider.propTypes = {
    children: PropTypes.any.isRequired,
}
