import i18n from '@dhis2/d2-i18n'
import { TableRowHead, TableCellHead } from '@dhis2/ui'
import cx from 'classnames'
import PropTypes from 'prop-types'
import React from 'react'
import { useMetadata, selectors } from '../../metadata/index.js'
import { useActiveCell } from '../data-entry-cell/index.js'
import styles from './category-combo-table.module.css'
import { PaddingCell } from './padding-cell.js'
import { TotalHeader } from './total-cells.js'

export const CategoryComboTableHeader = ({
    dataElements,
    renderRowTotals,
    paddingCells,
    categoryOptionCombos,
    categories,
}) => {
    const { data: metadata } = useMetadata()
    const { deId: activeDeId, cocId: activeCocId } = useActiveCell()

    // Computes the span and repeats for each columns in a category-row.
    // Repeats are the number of times the options in a category needs to be rendered per category-row
    let catColSpan = categoryOptionCombos.length
    const rowToColumnsMap = categories.map((c) => {
        const categoryOptions = selectors.getCategoryOptionsByCategoryId(
            metadata,
            c.id
        )
        const nrOfOptions = c.categoryOptions.length
        // catColSpan should always be equal to nrOfOptions in last iteration
        // unless anomaly with categoryOptionCombo-generation server-side
        if (nrOfOptions > 0 && catColSpan >= nrOfOptions) {
            // calculate colSpan for current options
            // this is the span for each option, not the "total" span of the row
            catColSpan = catColSpan / nrOfOptions
            // when table have multiple categories, options need to be repeated for each disaggregation "above" current-category
            const repeat =
                categoryOptionCombos.length / (catColSpan * nrOfOptions)

            const columnsToRender = new Array(repeat)
                .fill(0)
                .flatMap(() => categoryOptions)

            return {
                span: catColSpan,
                columns: columnsToRender,
                category: c,
            }
        } else {
            console.warn(
                `Category ${c.displayFormName} malformed. Number of options: ${nrOfOptions}, span: ${catColSpan}`
            )
        }
        return c
    })

    // Is the active cell in this cat-combo table? Check to see if active
    // data element is in this CCT
    const isThisTableActive = dataElements.some(({ id }) => id === activeDeId)

    // Find if this column header includes the active cell's column
    const isHeaderActive = (headerIdx, headerColSpan) => {
        const activeCellColIdx = categoryOptionCombos.findIndex(
            (coc) => activeCocId === coc.id
        )
        const idxDiff = activeCellColIdx - headerIdx * headerColSpan
        return isThisTableActive && idxDiff < headerColSpan && idxDiff >= 0
    }

    return rowToColumnsMap.map((colInfo, colInfoIndex) => {
        const { span, columns, category } = colInfo
        return (
            <TableRowHead key={category.id}>
                <TableCellHead
                    className={styles.categoryNameHeader}
                    colSpan={'1'}
                >
                    {category.displayFormName !== 'default' &&
                        category.displayFormName}
                </TableCellHead>
                {columns.map((co, columnIndex) => {
                    return (
                        <TableCellHead
                            key={columnIndex}
                            className={cx(styles.tableHeader, {
                                [styles.active]: isHeaderActive(
                                    columnIndex,
                                    span
                                ),
                            })}
                            colSpan={span.toString()}
                        >
                            {co.isDefault
                                ? i18n.t('Value')
                                : co.displayFormName}
                        </TableCellHead>
                    )
                })}
                {paddingCells.map((_, i) => (
                    <PaddingCell key={i} />
                ))}
                {renderRowTotals && colInfoIndex === 0 && (
                    <TotalHeader rowSpan={categories.length} />
                )}
            </TableRowHead>
        )
    })
}

CategoryComboTableHeader.propTypes = {
    categoryCombo: PropTypes.shape({
        id: PropTypes.string.isRequired,
        categoryOptionCombos: PropTypes.array,
    }).isRequired,
    categories: PropTypes.array,
    categoryOptionCombos: PropTypes.array,
    dataElements: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string.isRequired,
            categoryCombo: PropTypes.shape({
                id: PropTypes.string,
            }),
            displayFormName: PropTypes.string,
            valueType: PropTypes.string,
        })
    ),
    paddingCells: PropTypes.array,
    renderRowTotals: PropTypes.bool,
}
