import {
    Table,
    TableRowHead,
    TableHead,
    TableCellHead,
    TableBody,
    TableRow,
    TableCell,
} from '@dhis2/ui'
import React from 'react'
import styles from './data-table.module.css'
import { useMetadata } from './metadata-context.js'
import {
    getCategoriesByCategoryComboId,
    getCategoryOptionsByCategoryId,
    getCoCByCategoryOptions,
} from './selectors.js'
import { cartesian } from './utils.js'

/**
 * Computes the span and repeats for each columns in a category-row.
 * Repeats are the number of times the options in a category needs to be rendered per category-row
 * @param {*} categories
 * @param {*} computedCategoryOptions
 * @returns
 */
const computeColumnRenderInfo = (categories, computedCategoryOptions) => {
    let catColSpan = computedCategoryOptions.length
    const renderInfo = categories.reduce((acc, cat) => {
        const nrOfOptions = cat.categoryOptions.length
        if (nrOfOptions > 0 && catColSpan >= nrOfOptions) {
            catColSpan = catColSpan / nrOfOptions
            const total =
                computedCategoryOptions.length / (catColSpan * nrOfOptions)

            acc[cat.id] = {
                span: catColSpan,
                repeat: total,
            }
        }
        return acc
    }, {})

    return renderInfo
}

export const CategoryComboTable = ({
    categoryCombo,
    dataElements,
    getDataValue,
    filterText,
}) => {
    const { metadata } = useMetadata()

    const categories = getCategoriesByCategoryComboId(
        metadata,
        categoryCombo.id
    )

    const optionsIdLists = categories.map((cat) => cat.categoryOptions)

    // each element is a combination of category-options for a particular column
    // this results in lists of category-options in the same order as headers are rendered
    const computedCategoryOptions = cartesian(optionsIdLists)
    const categoryRenderInfo = computeColumnRenderInfo(
        categories,
        computedCategoryOptions
    )
    const rowToColumnsMap = categories.map((c) => {
        const categoryOptions = getCategoryOptionsByCategoryId(metadata, c.id)
        const renderInfo = categoryRenderInfo[c.id]
        const columnsToRender = new Array(renderInfo.repeat)
            .fill(0)
            .flatMap(() => categoryOptions)

        return {
            ...categoryRenderInfo[c.id],
            columns: columnsToRender,
            category: c,
        }
    })
    // find categoryOptionCombo by category-options
    const sortedCOCs = computedCategoryOptions
        .map((options) =>
            getCoCByCategoryOptions(metadata, categoryCombo.id, options)
        )
        .filter((coc) => !!coc)
    return (
        <Table>
            <TableHead>
                {rowToColumnsMap.map((colInfo) => {
                    const { span, columns } = colInfo
                    return (
                        <TableRowHead key={colInfo.category.id}>
                            <TableCellHead
                                className={styles.categoryNameHeader}
                                colSpan={'1'}
                            >
                                {colInfo.category.displayFormName === 'default'
                                    ? ''
                                    : colInfo.category.displayFormName}
                            </TableCellHead>
                            {columns.map((co, i) => {
                                return (
                                    <TableCellHead
                                        key={i}
                                        className={styles.tableHeader}
                                        colSpan={span.toString()}
                                    >
                                        {co.isDefault
                                            ? 'Value'
                                            : co.displayFormName}
                                    </TableCellHead>
                                )
                            })}
                        </TableRowHead>
                    )
                })}
            </TableHead>
            <TableBody>
                {dataElements
                    .filter(
                        (de) =>
                            !filterText ||
                            de.displayFormName
                                .toLowerCase()
                                .includes(filterText.toLowerCase())
                    )
                    .map((de) => {
                        return (
                            <TableRow key={de.id}>
                                <TableCell className={styles.tableCell}>
                                    <div style={{ minWidth: 150 }}>
                                        {de.displayFormName}
                                    </div>
                                </TableCell>
                                {sortedCOCs.map((coc) => (
                                    <TableCell
                                        key={coc.id}
                                        className={styles.tableCell}
                                    >
                                        <span>
                                            {getDataValue(de.id, coc.id)}
                                        </span>
                                    </TableCell>
                                ))}
                            </TableRow>
                        )
                    })}
            </TableBody>
        </Table>
    )
}
