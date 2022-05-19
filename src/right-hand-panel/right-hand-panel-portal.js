import { useContext } from 'react'
import { createPortal } from 'react-dom'
import { portalElementId } from './constants.js'
import RightHandPanelContext from './right-hand-panel-context.js'

export default function RightHandPanelPortal({ id, children }) {
    const rightHandPandelContext = useContext(RightHandPanelContext)

    if (id !== rightHandPandelContext.id) {
        return null
    }

    return createPortal(children, document.getElementById(portalElementId))
}
