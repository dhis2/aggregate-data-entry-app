import i18n from '@dhis2/d2-i18n'
import { IconCross24, colors } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import styles from './title.module.css'

const Title = ({ children, onClose }) => (
    <header className={styles.wrapper}>
        <span className={styles.title}>{children}</span>
        <button
            className={styles.closeButton}
            title={i18n.t('Close details sidebar')}
            onClick={onClose}
        >
            <IconCross24 color={colors.grey700} />
        </button>
    </header>
)

Title.propTypes = {
    children: PropTypes.string.isRequired,
    onClose: PropTypes.func.isRequired,
}

export default Title
