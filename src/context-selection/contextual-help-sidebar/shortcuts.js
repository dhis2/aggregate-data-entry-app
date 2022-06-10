import i18n from '@dhis2/d2-i18n'
import { Divider } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import { ExpandableUnit } from '../../shared/index.js'
import styles from './shortcuts.module.css'

const Shortcut = ({ name, shortcut1, shortcut2 }) => (
    <div className={styles.helpItem}>
        <div>{name}</div>
        <div className={styles.shortcutKeys}>
            <span className={styles.shortcutKey}>{shortcut1}</span>
            <span className={styles.shortcutKey}>{shortcut2}</span>
        </div>
    </div>
)

Shortcut.propTypes = {
    name: PropTypes.string.isRequired,
    shortcut1: PropTypes.string.isRequired,
    shortcut2: PropTypes.string.isRequired,
}

const Shortcuts = () => (
    <ExpandableUnit title={i18n.t('Shortcuts')} initiallyOpen>
        <Shortcut
            name={i18n.t('Show details')}
            shortcut1={i18n.t('Shift + Enter')}
            shortcut2={i18n.t('Double click')}
        />
        <Divider />
        <Shortcut
            name={i18n.t('Go to next cell')}
            shortcut1={i18n.t('Tab')}
            shortcut2="↓"
        />
        <Divider />
        <Shortcut
            name={i18n.t('Go to previous cell')}
            shortcut1={i18n.t('Shift + Tab')}
            shortcut2="↑"
        />
    </ExpandableUnit>
)

export default Shortcuts
