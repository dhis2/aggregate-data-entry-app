import PropTypes from 'prop-types'
import React from 'react'
import styles from './single-selection-label.module.css'

export const IconEmpty = ({ dataTest }) => (
    <svg
        height="18px"
        version="1.1"
        viewBox="0 0 18 18"
        width="18px"
        data-test={`${dataTest}-iconempty`}
        className={styles.iconDefaultStyle}
    >
        <g
            fill="none"
            fillRule="evenodd"
            id="icon/empty"
            stroke="none"
            strokeWidth="1"
        />
    </svg>
)

IconEmpty.propTypes = {
    dataTest: PropTypes.string.isRequired,
}
