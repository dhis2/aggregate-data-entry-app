import { useConfig } from '@dhis2/app-runtime'
import { Menu, MenuItem } from '@dhis2/ui'
import moment from 'moment'
import PropTypes from 'prop-types'
import React from 'react'
import { getFixedPeriodsByTypeAndYear, usePeriod } from '../../shared/index.js'
import { usePeriodId } from '../use-context-selection/index.js'
import classes from './period-menu.module.css'

const getPeriods = ({ periodType, year, dateFormat }) =>
    getFixedPeriodsByTypeAndYear({
        periodType,
        year,
        formatYyyyMmDd: (date) => {
            if (periodType === 'Daily') {
                // moment format tokens are case sensitive
                // see https://momentjs.com/docs/#/parsing/string-format/
                return moment(date).format(dateFormat.toUpperCase())
            }
            return moment(date).format('YYYY-MM-DD')
        },
        config: {
            reversePeriods: true,
        },
    })

export default function PeriodMenu({ periodType, year, onChange }) {
    const [periodId] = usePeriodId()
    const selectedPeriod = usePeriod(periodId)
    const {
        systemInfo: { dateFormat },
    } = useConfig()
    const periods = getPeriods({ periodType, year, dateFormat })

    return (
        <Menu dense className={classes.menu} dataTest="period-selector-menu">
            {periods.map((period) => (
                <MenuItem
                    active={period.id === selectedPeriod?.id}
                    key={period.id}
                    label={
                        <span data-value={period.id}>{period.displayName}</span>
                    }
                    onClick={() => onChange({ selected: period.id })}
                />
            ))}
        </Menu>
    )
}

PeriodMenu.propTypes = {
    onChange: PropTypes.func.isRequired,
    periodType: PropTypes.string,
    year: PropTypes.number,
}
