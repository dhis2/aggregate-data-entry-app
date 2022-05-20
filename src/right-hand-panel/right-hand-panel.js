import React from 'react'
import { portalElementId } from './constants.js'
import styles from './right-hand-panel.module.css'

const PortalAnchor = React.memo(function PortalAnchor() {
    return (
        <div
            id={portalElementId}
            className={styles.anchorPortal}
        />
    )
})

export default function RightHandPanel() {
    return (
        <div className={styles.wrapper}>
            <PortalAnchor />
        </div>
    )
}
