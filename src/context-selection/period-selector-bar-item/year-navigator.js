import i18n from '@dhis2/d2-i18n'
import { Button, IconArrowRight24, IconArrowLeft24 } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import { startingYears } from '../../shared/index.js'
import classes from './year-navigator.module.css'

export default function YearNavigator({
    maxYear,
    year,
    onYearChange,
    calendar,
}) {
    const startYear = startingYears[calendar] ?? startingYears.default
    return (
        <div className={classes.container}>
            <Button
                dataTest="yearnavigator-backbutton"
                disabled={year <= startYear}
                onClick={() => onYearChange(year - 1)}
                icon={
                    i18n.dir() === 'rtl' ? (
                        <IconArrowRight24 />
                    ) : (
                        <IconArrowLeft24 />
                    )
                }
            />
            <span
                data-test="yearnavigator-currentyear"
                className={classes.year}
            >
                {year}
            </span>
            <Button
                dataTest="yearnavigator-forwardbutton"
                disabled={year >= maxYear}
                onClick={() => onYearChange(year + 1)}
                icon={
                    i18n.dir() === 'rtl' ? (
                        <IconArrowLeft24 />
                    ) : (
                        <IconArrowRight24 />
                    )
                }
            />
        </div>
    )
}

YearNavigator.propTypes = {
    calendar: PropTypes.string,
    maxYear: PropTypes.number,
    year: PropTypes.number,
    onYearChange: PropTypes.func,
}
