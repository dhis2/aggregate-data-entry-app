import { TableCell } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import styles from '../table-body.module.css'
import { useIndicatorValue } from './use-indicator-value.js'

export const IndicatorTableCell = ({ denominator, numerator }) => {
    const indicatorValue = useIndicatorValue({ denominator, numerator })
    return (
        <TableCell className={styles.indicatorCell}>{indicatorValue}</TableCell>
    )
}

IndicatorTableCell.propTypes = {
    // These can all be "formulas" but also string representations of numbers
    denominator: PropTypes.string.isRequired,
    numerator: PropTypes.string.isRequired,
}
