import PropTypes from 'prop-types'
import React from 'react'
import styles from './sidebar.module.css'

export default function Sidebar({ children }) {
    return <div className={styles.wrapper}>{children}</div>
}

Sidebar.propTypes = {
    children: PropTypes.any.isRequired,
}
