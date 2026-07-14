import i18n from '@dhis2/d2-i18n'
import { TableCell, Tooltip, IconInfo16, IconWarning16 } from '@dhis2/ui'
import cx from 'classnames'
import PropTypes from 'prop-types'
import React, { useState } from 'react'
import {
    useHighlightedFieldStore,
    useComponentWillUnmount,
} from '../../shared/index.js'
import styles from '../table-body.module.css'
import {
    NONCALCULABLE_VALUE,
    MATHEMATICALLY_INVALID_VALUE,
} from './compute-indicator-value.js'
import { useIndicatorValue } from './use-indicator-value.js'

const InvalidIndicatorWrapper = ({ tooltipText, invalid }) => (
    <TableCell className={styles.indicatorCellNoncalculable}>
        <Tooltip content={tooltipText}>
            {invalid ? <IconWarning16 /> : <IconInfo16 />}
        </Tooltip>
    </TableCell>
)

InvalidIndicatorWrapper.propTypes = {
    invalid: PropTypes.bool,
    tooltipText: PropTypes.string,
}

export const IndicatorTableCell = ({
    denominator,
    factor,
    indicatorId,
    numerator,
    decimals,
}) => {
    const {
        value: indicatorValue,
        numeratorValue,
        denominatorValue,
    } = useIndicatorValue({
        denominator,
        factor,
        numerator,
        decimals,
    })

    const setHighlightedFieldId = useHighlightedFieldStore(
        (state) => state.setHighlightedField
    )

    const [active, setActive] = useState(false)
    const highlighted = useHighlightedFieldStore((state) =>
        state.isFieldHighlighted({
            indicatorId: indicatorId,
        })
    )

    useComponentWillUnmount(() => {
        if (highlighted) {
            setHighlightedFieldId(null)
        }
    }, [highlighted, setHighlightedFieldId])

    if (indicatorValue === NONCALCULABLE_VALUE) {
        return (
            <InvalidIndicatorWrapper
                tooltipText={i18n.t(
                    'This value cannot be calculated in this app'
                )}
            />
        )
    }

    if (indicatorValue === MATHEMATICALLY_INVALID_VALUE) {
        return (
            <InvalidIndicatorWrapper
                tooltipText={i18n.t(
                    `This expression is not mathematically calculable {{numeratorValue}}/{{denominatorValue}}`,
                    { numeratorValue, denominatorValue }
                )}
                invalid={true}
            />
        )
    }

    return (
        <TableCell className={styles.indicatorCell}>
            <div
                tabIndex="0"
                className={cx(styles.indicatorCellFocusWrapper, {
                    [styles.activeCell]: active,
                    [styles.highlightedCell]: highlighted,
                })}
                onFocus={() => {
                    setActive(true)
                    setHighlightedFieldId({ indicatorId: indicatorId })
                }}
                onBlur={() => {
                    setActive(false)
                }}
            >
                {indicatorValue}
            </div>
        </TableCell>
    )
}

IndicatorTableCell.propTypes = {
    denominator: PropTypes.string.isRequired,
    factor: PropTypes.number.isRequired,
    indicatorId: PropTypes.string.isRequired,
    numerator: PropTypes.string.isRequired,
    decimals: PropTypes.number,
}
