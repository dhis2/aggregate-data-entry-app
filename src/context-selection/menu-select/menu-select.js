import { Menu, MenuItem } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import css from './menu-select.module.css'

export default function MenuSelect({ values, selected, onChange }) {
    return (
        <div className={css.menuSelect}>
            <Menu>
                {values.map(({ value, label }) => (
                    <MenuItem
                        key={value || label}
                        label={label}
                        active={selected === value}
                        onClick={() => onChange({ selected: value })}
                    />
                ))}
            </Menu>
        </div>
    )
}

MenuSelect.propTypes = {
    values: PropTypes.arrayOf(
        PropTypes.shape({
            label: PropTypes.string.isRequired,
            value: PropTypes.string,
        })
    ).isRequired,
    onChange: PropTypes.func.isRequired,
    selected: PropTypes.string,
}
10
