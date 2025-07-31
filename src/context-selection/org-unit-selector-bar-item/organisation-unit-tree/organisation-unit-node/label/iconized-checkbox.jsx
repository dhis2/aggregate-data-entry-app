import { Checkbox } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import { Icon } from './icon.jsx'
import styles from './single-selection-label.module.css'

export const IconizedCheckbox = ({
    checked,
    dataTest,
    hasChildren,
    indeterminate,
    children,
    loading,
    name,
    open,
    value,
    onChange,
}) => {
    const icon = (
        <Icon
            loading={loading}
            open={open}
            hasChildren={hasChildren}
            dataTest={dataTest}
        />
    )

    const checkboxLabel = (
        <>
            <span className={styles.iconizedCheckbox}>{icon}</span>
            {children}
        </>
    )

    return (
        <>
            <Checkbox
                dense
                checked={checked}
                name={name}
                value={value}
                label={checkboxLabel}
                indeterminate={indeterminate}
                onChange={onChange}
            />
        </>
    )
}

IconizedCheckbox.propTypes = {
    checked: PropTypes.bool.isRequired,
    children: PropTypes.any.isRequired,
    dataTest: PropTypes.string.isRequired,
    hasChildren: PropTypes.bool.isRequired,
    indeterminate: PropTypes.bool.isRequired,
    loading: PropTypes.bool.isRequired,
    name: PropTypes.string.isRequired,
    open: PropTypes.bool.isRequired,
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
}
