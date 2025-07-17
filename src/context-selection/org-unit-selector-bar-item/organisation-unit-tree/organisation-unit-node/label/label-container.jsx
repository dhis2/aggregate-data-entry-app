import cx from 'classnames'
import PropTypes from 'prop-types'
import React from 'react'
import styles from './single-selection-label.module.css'

/**
 * @param {Object} props
 * @param {bool} props.highlighted
 * @param {React.Component|React.Component[]} props.children
 * @returns {React.Component}
 */
export const LabelContainer = ({ highlighted, children }) => (
    <div
        className={cx(styles.labelContainer, {
            [styles.labelContainerHighlighted]: highlighted,
        })}
    >
        <span>{children}</span>
    </div>
)

LabelContainer.propTypes = {
    children: PropTypes.node,
    highlighted: PropTypes.bool,
}
