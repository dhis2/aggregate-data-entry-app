import PropTypes from 'prop-types'
import React from 'react'
import styles from './single-selection-label.module.css'

export const IconSingle = ({ dataTest }) => (
    <svg
        height="18px"
        version="1.1"
        viewBox="0 0 18 18"
        width="18px"
        data-test={`${dataTest}-iconsingle`}
        className={styles.iconDefaultStyle}
    >
        <g
            fill="none"
            fillRule="evenodd"
            id="icon/single"
            stroke="none"
            strokeWidth="1"
        >
            <rect
                fill="#A0ADBA"
                height="4"
                id="Rectangle"
                rx="1"
                width="4"
                x="7"
                y="7"
            />
        </g>
    </svg>
)

IconSingle.propTypes = {
    dataTest: PropTypes.string.isRequired,
}
