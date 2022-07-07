import React, { useContext } from 'react'
import { ContextualHelpSidebar } from '../context-selection/contextual-help-sidebar/index.js'
import { DataDetailsSidebar } from '../data-workspace/index.js'
import RightHandPanelContext from './right-hand-panel-context.js'
import styles from './right-hand-panel.module.css'

const idSidebarMap = {
    'data-details': DataDetailsSidebar,
    'contextual-help': ContextualHelpSidebar,
}

export default function RightHandPanel() {
    const { id, show, hide } = useContext(RightHandPanelContext)
    const SidebarComponent = idSidebarMap[id]

    if (id && !SidebarComponent) {
        throw new Error(`Could not find a sidebar component for id "${id}"`)
    }

    if (!SidebarComponent) {
        return <div className={styles.wrapper} />
    }

    return (
        <div className={styles.wrapper}>
            <SidebarComponent show={show} hide={hide} />
        </div>
    )
}
