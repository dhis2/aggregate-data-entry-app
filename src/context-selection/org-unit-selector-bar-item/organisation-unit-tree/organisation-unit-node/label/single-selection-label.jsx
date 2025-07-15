import cx from 'classnames'
import PropTypes from 'prop-types'
import React from 'react'
import styles from './single-selection-label.module.css'

/**
 * @param {Object} props
 * @param {string} props.label
 * @param {bool} [props.checked]
 * @param {bool} [props.loading]
 * @param {Function} [props.onChange]
 * @returns {React.Component}
 */
export const SingleSelectionLabel = ({
    checked,
    children,
    onChange,
    loading,
}) => (
    <span
        onClick={(event) => {
            const payload = { checked: !checked }
            onChange(payload, event)
        }}
        className={cx(styles.singleSelectSpan, {
            [styles.checked]: checked,
            [styles.loading]: loading,
        })}
    >
        {children}
    </span>
)

SingleSelectionLabel.propTypes = {
    children: PropTypes.any.isRequired,
    checked: PropTypes.bool,
    loading: PropTypes.bool,
    onChange: PropTypes.func,
}
