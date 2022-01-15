import PropTypes from 'prop-types'
import React from 'react'
import BasicInformation from './basic-information.js'
import styles from './sidebar.module.css'
import Title from './title.js'
import ToggleableUnit from './toggleable-unit.js'

const Sidebar = ({ onClose }) => (
    <div className={styles.wrapper}>
        <Title onClose={onClose} />
        <BasicInformation />
        <ToggleableUnit title="Test unit">
            <span>Example content</span>
        </ToggleableUnit>
        <ToggleableUnit title="Disabled unit" disabled />
        <ToggleableUnit title="Another test unit">
            <span>Example content</span>
        </ToggleableUnit>
    </div>
)

Sidebar.propTypes = {
    onClose: PropTypes.func.isRequired,
}

export default Sidebar
