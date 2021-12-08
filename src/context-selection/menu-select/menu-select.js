import { Menu, MenuItem } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import css from './menu-select.module.css'

const MenuSelect = ({ values, selected, onChange }) => {
    return (
        <div className={css.menuSelect}>
            <Menu>
                {values.map(({ value, label }) => (
                    <MenuItem
                        key={value}
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
            value: PropTypes.string.isRequired,
        })
    ).isRequired,
    onChange: PropTypes.func.isRequired,
    selected: PropTypes.string,
}

export default MenuSelect
