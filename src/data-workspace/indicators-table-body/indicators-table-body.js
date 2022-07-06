import i18n from '@dhis2/d2-i18n'
import {
    TableRowHead,
    TableCellHead,
    TableBody,
    TableRow,
    TableCell,
} from '@dhis2/ui'
import cx from 'classnames'
import PropTypes from 'prop-types'
import React from 'react'
import styles from '../table-body.module.css'
import { IndicatorTableCell } from './indicator-table-cell.js'

export const IndicatorsTableBody = ({
    indicators,
    maxColumnsInSection,
    filterText,
    globalFilterText,
}) => {
    const filteredIndicators = indicators.filter((indicator) => {
        const name = indicator.displayFormName.toLowerCase()
        return (
            (!filterText || name.includes(filterText.toLowerCase())) &&
            (!globalFilterText || name.includes(globalFilterText.toLowerCase()))
        )
    })
    const itemsHiddenCnt = indicators.length - filteredIndicators.length
    const padColumns = Array(maxColumnsInSection - 1).fill(0)

    return (
        <TableBody>
            <TableRowHead>
                <TableCellHead className={styles.categoryNameHeader}>
                    {i18n.t('Indicators')}
                </TableCellHead>
                <TableCellHead className={styles.tableHeader}>
                    {i18n.t('Values')}
                </TableCellHead>
                {padColumns.map((_, i) => (
                    <TableCell
                        key={i}
                        className={styles.paddingCell}
                    ></TableCell>
                ))}
            </TableRowHead>

            {filteredIndicators.map((indicator) => {
                return (
                    <TableRow key={indicator.id}>
                        <TableCell className={cx(styles.dataElementName)}>
                            {indicator.displayFormName}
                        </TableCell>
                        <IndicatorTableCell
                            denominator={indicator.denominator}
                            explodedDenominator={indicator.explodedDenominator}
                            explodedNumerator={indicator.explodedNumerator}
                            numerator={indicator.numerator}
                        />
                        {padColumns.map((_, i) => (
                            <TableCell
                                key={i}
                                className={styles.paddingCell}
                            ></TableCell>
                        ))}
                    </TableRow>
                )
            })}
            {itemsHiddenCnt > 0 && (
                <TableRow>
                    <TableCell
                        className={styles.hiddenByFilterCell}
                        colSpan={(maxColumnsInSection + 1).toString()}
                    >
                        {itemsHiddenCnt === 1
                            ? i18n.t('1 item hidden by filter')
                            : i18n.t('{{count}} items hidden by filter', {
                                  count: itemsHiddenCnt,
                              })}
                    </TableCell>
                </TableRow>
            )}
        </TableBody>
    )
}

IndicatorsTableBody.propTypes = {
    indicators: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string.isRequired,
            displayFormName: PropTypes.string,
        })
    ).isRequired,
    filterText: PropTypes.string,
    globalFilterText: PropTypes.string,
    maxColumnsInSection: PropTypes.number,
}
