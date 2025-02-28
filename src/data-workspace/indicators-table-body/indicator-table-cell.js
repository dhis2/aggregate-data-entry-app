import i18n from '@dhis2/d2-i18n'
import { TableCell, Tooltip, IconInfo16 } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import { useForm } from 'react-final-form'
import { useBlurredField } from '../../shared/index.js'
import styles from '../table-body.module.css'
import { NONCALCULABLE_VALUE } from './compute-indicator-value.js'
import { useIndicatorValue } from './use-indicator-value.js'

export const IndicatorTableCell = ({
    denominator,
    factor,
    numerator,
    decimals,
}) => {
    const form = useForm()
    const blurredField = useBlurredField()
    const indicatorValue = useIndicatorValue({
        blurredField,
        denominator,
        factor,
        form,
        numerator,
        decimals,
    })

    if (indicatorValue === NONCALCULABLE_VALUE) {
        return (
            <TableCell className={styles.indicatorCellNoncalculable}>
                <Tooltip
                    content={i18n.t(
                        'This value cannot be calculated in this app'
                    )}
                >
                    <IconInfo16 />
                </Tooltip>
            </TableCell>
        )
    }

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
