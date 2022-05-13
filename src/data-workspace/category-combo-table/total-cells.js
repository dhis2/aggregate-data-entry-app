import i18n from '@dhis2/d2-i18n'
import { TableCell, TableCellHead, TableRow } from '@dhis2/ui'
import propTypes from 'prop-types'
import React from 'react'
import {
    calculateColumnTotals,
    calculateRowTotals,
} from './calculate-totals.js'
import styles from './category-combo-table.module.css'
import { useValueMatrix } from './use-value-matrix.js'

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

export const RowTotal = ({ dataElements, categoryOptionCombos, row }) => {
    const matrix = useValueMatrix(dataElements, categoryOptionCombos)
    const rowTotals = calculateRowTotals(matrix)
    const currentTotal = rowTotals[row]

    return <TotalCell>{currentTotal}</TotalCell>
}

RowTotal.propTypes = {
    categoryOptionCombos: propTypes.array,
    dataElements: propTypes.array,
    row: propTypes.number,
}

export const ColumnTotals = ({
    renderTotalSum,
    paddedCells,
    dataElements,
    categoryOptionCombos,
}) => {
    const matrix = useValueMatrix(dataElements, categoryOptionCombos)
    const columnTotals = calculateColumnTotals(matrix)
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
    categoryOptionCombos: propTypes.array,
    dataElements: propTypes.array,
    paddedCells: propTypes.array,
    renderTotalSum: propTypes.bool,
}
