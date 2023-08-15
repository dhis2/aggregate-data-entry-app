import i18n from '@dhis2/d2-i18n'
import { Menu, MenuItem } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import { usePeriod, usePeriodId } from '../../shared/index.js'
import classes from './period-menu.module.css'

export default function PeriodMenu({ onChange, periods }) {
    const [periodId] = usePeriodId()
    const selectedPeriod = usePeriod(periodId)

    if (periods.length === 0) {
        return (
            <div className={classes.noPeriods}>
                {i18n.t('No periods available in this year')}
            </div>
        )
    }

    return (
        <Menu dense className={classes.menu} dataTest="period-selector-menu">
            {periods.map((period) => (
                <MenuItem
                    active={period.id === selectedPeriod?.id}
                    key={period.id}
                    label={<span data-value={period.id}>{period.name}</span>}
                    onClick={() => onChange({ selected: period.id })}
                />
            ))}
        </Menu>
    )
}

PeriodMenu.propTypes = {
    periods: PropTypes.arrayOf(
        PropTypes.shape({
            displayName: PropTypes.string.isRequired,
            id: PropTypes.string.isRequired,
        })
    ).isRequired,
    onChange: PropTypes.func.isRequired,
}
