import i18n from '@dhis2/d2-i18n'
import { TableCell, TableCellHead, TableRow } from '@dhis2/ui'
import propTypes from 'prop-types'
import React from 'react'
import styles from './category-combo-table.module.css'

export const TotalCell = ({ children }) => (
    <TableCell className={styles.totalCell}>{children}</TableCell>
)

TotalCell.propTypes = {
    children: propTypes.node,
}

export const TotalHeader = ({ rowSpan }) => (
    <TableCellHead className={styles.totalHeader} rowSpan={rowSpan}>
        {i18n.t('Totals')}
    </TableCellHead>
)

TotalHeader.propTypes = {
    rowSpan: propTypes.number,
}

export const ColumnTotals = ({ columnTotals, renderTotalSum, paddedCells }) => {
    return (
        <TableRow>
            <TableCellHead className={styles.totalHeader}>
                {i18n.t('Totals')}
            </TableCellHead>
            {columnTotals.map((v, i) => (
                <TotalCell key={i}>{v}</TotalCell>
            ))}
            {paddedCells.map((_, i) => (
                <TotalCell key={i} />
            ))}
            {renderTotalSum && (
                <TotalCell>
                    {columnTotals.reduce((acc, curr) => acc + curr)}
                </TotalCell>
            )}
        </TableRow>
    )
}

ColumnTotals.propTypes = {
    columnTotals: propTypes.arrayOf(propTypes.number),
    paddedCells: propTypes.array,
    renderTotalSum: propTypes.bool,
}
