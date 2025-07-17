import cx from 'classnames'
import PropTypes from 'prop-types'
import React from 'react'
import styles from './right-hand-panel.module.css'
import useCloseRightHandPanelOnSelectionChange from './use-close-right-hand-panel-on-selection-change.js'
import useRightHandPanelContext from './use-right-hand-panel-context.js'

export default function RightHandPanel({ idSidebarMap }) {
    const { id, show, hide } = useRightHandPanelContext()
    useCloseRightHandPanelOnSelectionChange()

    const SidebarComponent = idSidebarMap[id]

    if (id && !SidebarComponent) {
        throw new Error(`Could not find a sidebar component for id "${id}"`)
    }

    if (!SidebarComponent) {
        return <div className={styles.wrapper} />
    }

    return (
        <div className={cx(styles.wrapper, styles.hideForPrint)}>
            <SidebarComponent show={show} hide={hide} />
        </div>
    )
}

RightHandPanel.propTypes = {
    idSidebarMap: PropTypes.object.isRequired,
}
