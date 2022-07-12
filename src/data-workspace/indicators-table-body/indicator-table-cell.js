import { TableCell } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import styles from '../table-body.module.css'
import { useIndicatorValue } from './use-indicator-value.js'

export const IndicatorTableCell = ({ denominator, numerator, factor }) => {
    const indicatorValue = useIndicatorValue({ denominator, numerator, factor })
    return (
        <TableCell className={styles.indicatorCell}>{indicatorValue}</TableCell>
    )
}

IndicatorTableCell.propTypes = {
    denominator: PropTypes.string.isRequired,
    factor: PropTypes.number.isRequired,
    numerator: PropTypes.string.isRequired,
}
