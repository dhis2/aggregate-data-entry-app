import i18n from '@dhis2/d2-i18n'
import { TableCell, TableCellHead, TableRow } from '@dhis2/ui'
import cx from 'classnames'
import propTypes from 'prop-types'
import React, { useMemo } from 'react'
import styles from '../table-body.module.css'
import { calculateColumnTotals, calculateRowTotal } from './calculate-totals.js'
import { useValueMatrix } from './use-value-matrix.js'

const defaultEmptyArray = []

export const PaddingCell = ({ children, colSpan }) => (
    <TableCell
        className={cx('total-cell', styles.totalCell)}
        dataTest="dhis2-dataentry-totalcell-padding"
        colSpan={colSpan}
    >
        {children}
    </TableCell>
)

PaddingCell.propTypes = {
    children: propTypes.node,
    colSpan: propTypes.number,
}

export const TotalCell = ({ children }) => (
    <TableCell
        className={cx('total-cell', styles.totalCell)}
        dataTest="dhis2-dataentry-totalcell"
    >
        {children}
    </TableCell>
)

TotalCell.propTypes = {
    children: propTypes.node,
}

export const TotalHeader = ({ rowSpan }) => (
    <TableCellHead className={styles.totalHeader} rowSpan={rowSpan.toString()}>
        {i18n.t('Totals')}
    </TableCellHead>
)

TotalHeader.propTypes = {
    rowSpan: propTypes.string,
}

export const RowTotal = ({
    dataElements,
    categoryOptionCombos,
    row,
    pivotType = 'none',
    pivotedCategory,
    categories,
}) => {
    const matrix = useValueMatrix({
        dataElements,
        sortedCOCs: categoryOptionCombos,
        pivotType,
        pivotedCategory,
        categories,
    })
    const rowTotal = useMemo(
        () => calculateRowTotal(matrix, row),
        [matrix, row]
    )
    return <TotalCell>{rowTotal}</TotalCell>
}

RowTotal.propTypes = {
    categories: propTypes.array,
    categoryOptionCombos: propTypes.array,
    dataElements: propTypes.array,
    pivotType: propTypes.oneOf(['move_categories', 'pivot', 'none']),
    pivotedCategory: propTypes.string,
    row: propTypes.number,
}

export const ColumnTotals = ({
    renderTotalSum,
    initialColumns = 1,
    paddingCells,
    dataElements = defaultEmptyArray,
    categoryOptionCombos = defaultEmptyArray,
    pivotType = 'none',
    pivotedCategory = null,
    categories = defaultEmptyArray,
}) => {
    const matrix = useValueMatrix({
        dataElements,
        sortedCOCs: categoryOptionCombos,
        pivotType,
        pivotedCategory,
        categories,
    })
    const columnTotals = useMemo(() => calculateColumnTotals(matrix), [matrix])

    return (
        <TableRow dataTest="dhis2-dataentry-columntotals">
            <TableCellHead
                className={styles.totalHeader}
                colSpan={initialColumns?.toString()}
            >
                {i18n.t('Totals')}
            </TableCellHead>

            {columnTotals.map((v, i) => (
                <TotalCell key={i}>{v}</TotalCell>
            ))}
            {paddingCells.map((_, i) => (
                <TotalCell key={i} />
            ))}
            {renderTotalSum && (
                <TotalCell>
                    {columnTotals.reduce((acc, curr) => acc + curr, 0)}
                </TotalCell>
            )}
        </TableRow>
    )
}

ColumnTotals.propTypes = {
    categories: propTypes.array,
    categoryOptionCombos: propTypes.array,
    dataElements: propTypes.array,
    initialColumns: propTypes.number,
    paddingCells: propTypes.array,
    pivotType: propTypes.oneOf(['move_categories', 'pivot', 'none']),
    pivotedCategory: propTypes.string,
    renderTotalSum: propTypes.bool,
}
