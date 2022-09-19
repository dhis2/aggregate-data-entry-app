import PropTypes from 'prop-types'
import React from 'react'
import limitInputLabelsByName from './limits-input-labels-by-name.js'
import styles from './limits-validation-error-message.module.css'

export default function LimitsValidationErrorMessage({ errors, touched }) {
    if (!errors.min && !errors.max) {
        return null
    }

    const errorMessages = Object.entries(errors).filter(([key]) => touched[key])

    return (
        <div className={styles.container}>
            {errorMessages.map(([name, errorMsg]) => (
                <span key={name} className={styles.error}>
                    <span className={styles.errorLabel}>
                        {limitInputLabelsByName[name]}
                    </span>

                    <span className={styles.errorMessage}>{errorMsg}</span>
                </span>
            ))}
        </div>
    )
}

LimitsValidationErrorMessage.propTypes = {
    errors: PropTypes.object,
    touched: PropTypes.object,
}
