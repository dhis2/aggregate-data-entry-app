import i18n from '@dhis2/d2-i18n'
import { IconChevronUp24, IconChevronDown24, colors } from '@dhis2/ui'
import cx from 'classnames'
import PropTypes from 'prop-types'
import React, { useState } from 'react'
import styles from './toggleable-unit.module.css'

const ToggleableUnit = ({ title, children, disabled }) => {
    const [open, setOpen] = useState(false)
    const chevronColor = disabled ? colors.grey400 : colors.grey700
    const handleClick = (event) => {
        event.preventDefault()
        if (disabled) {
            return
        }
        setOpen(!open)
    }

    return (
        <details
            open={disabled ? false : open}
            onClick={handleClick}
            className={cx(styles.toggleableUnit, {
                [styles.disabled]: disabled,
                [styles.open]: open,
            })}
        >
            <summary tabIndex={disabled ? '-1' : undefined} className={styles.title}>
                {disabled ? i18n.t('{{title}} (disabled)', { title }) : title}
                {open ? (
                    <IconChevronUp24 color={chevronColor} />
                ) : (
                    <IconChevronDown24 color={chevronColor} />
                )}
            </summary>
            <div className={styles.content}>{children}</div>
        </details>
    )
}

ToggleableUnit.propTypes = {
    title: PropTypes.string.isRequired,
    children: PropTypes.node,
    disabled: PropTypes.bool,
}

export default ToggleableUnit
