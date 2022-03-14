import PropTypes from 'prop-types'
import React from 'react'
import styles from './data-entry-cell.module.css'

export const DataEntryCell = ({ children }) => (
    <td className={styles.dataEntryCell}>{children}</td>
)
DataEntryCell.propTypes = {
    children: PropTypes.node,
}
