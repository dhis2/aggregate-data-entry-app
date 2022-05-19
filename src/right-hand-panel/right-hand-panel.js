import React, { PureComponent } from 'react'
import { portalElementId } from './constants.js'
import styles from './right-hand-panel.module.css'

class PortalAnchor extends PureComponent {
    render() {
        return <div id={portalElementId} className={styles.anchorPortal} />
    }
}

export default function RightHandPanel() {
    return (
        <div className={styles.wrapper}>
            <PortalAnchor />
        </div>
    )
}
