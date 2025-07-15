import PropTypes from 'prop-types'
import React from 'react'
import styles from './error-message.module.css'

export const ErrorMessage = ({ children, dataTest }) => (
    <span data-test={`${dataTest}-error`} className={styles.errorMessageSpan}>
        {children}
    </span>
)

ErrorMessage.propTypes = {
    children: PropTypes.any.isRequired,
    dataTest: PropTypes.string.isRequired,
}
