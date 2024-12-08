import { TableCell } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import { useBlurredField } from '../../shared/index.js'
import styles from '../table-body.module.css'
import { useIndicatorValue } from './use-indicator-value.js'

export const IndicatorTableCell = ({
    denominator,
    factor,
    numerator,
    decimals,
}) => {
    const blurredField = useBlurredField()
    const indicatorValue = useIndicatorValue({
        blurredField,
        denominator,
        factor,
        numerator,
        decimals,
    })

    return (
        <TableCell className={styles.indicatorCell}>{indicatorValue}</TableCell>
    )
}

IndicatorTableCell.propTypes = {
    denominator: PropTypes.string.isRequired,
    factor: PropTypes.number.isRequired,
    numerator: PropTypes.string.isRequired,
    decimals: PropTypes.number,
}
