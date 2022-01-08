import i18n from '@dhis2/d2-i18n'
import {
    Table,
    TableRowHead,
    TableHead,
    TableCellHead,
    TableBody,
    TableRow,
    TableCell,
    colors,
} from '@dhis2/ui'
import cx from 'classnames'
import PropTypes from 'prop-types'
import React from 'react'
import css from 'styled-jsx/css'
import styles from './category-combo-table.module.css'
import { DataEntryCell } from './data-entry-cell.js'
import { useMetadata } from './metadata-context.js'
import {
    getCategoriesByCategoryComboId,
    getCategoryOptionsByCategoryId,
    getCoCByCategoryOptions,
} from './selectors.js'
import { cartesian } from './utils.js'

// todo: remove once DataEntryCell is mature
const DataValue = ({ dataValue }) => {
    return <span>{dataValue ? dataValue.value : null}</span>
}

const { className: tableClassName, styles: tableStyles } = css.resolve`
    table.dataEntryTable {
        // A weird fix to allow table cells to use 'height: 100%':
        height: 100%;
    }
`

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
    // the result is a client side computation of categoryOption-combinations
    const computedCategoryOptions = cartesian(optionsIdLists)

    // Computes the span and repeats for each columns in a category-row.
    // Repeats are the number of times the options in a category needs to be rendered per category-row
    let catColSpan = computedCategoryOptions.length
    const rowToColumnsMap = categories.map((c) => {
        const categoryOptions = getCategoryOptionsByCategoryId(metadata, c.id)
        const nrOfOptions = c.categoryOptions.length
        if (nrOfOptions > 0 && catColSpan >= nrOfOptions) {
            catColSpan = catColSpan / nrOfOptions
            const repeat =
                computedCategoryOptions.length / (catColSpan * nrOfOptions)

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

    // find categoryOptionCombos by category-options
    const sortedCOCs = computedCategoryOptions
        .map((options) =>
            getCoCByCategoryOptions(metadata, categoryCombo.id, options)
        )
        .filter((coc) => !!coc)

    const filteredDataElements = dataElements.filter(
        (de) =>
            !filterText ||
            de.displayFormName.toLowerCase().includes(filterText.toLowerCase())
    )
    const itemsHiddenCnt = dataElements.length - filteredDataElements.length
    return (
        <Table
            suppressZebraStriping
            className={cx('dataEntryTable', tableClassName)}
        >
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
                                    <div style={{ minWidth: 240 }}>
                                        {de.displayFormName}
                                    </div>
                                </TableCell>
                                {sortedCOCs.map((coc) => (
                                    // todo: may want to pass getDataValue into DataEntryCell
                                    // to access "Data Item Details" (comment, followup, name, etc)
                                    <DataEntryCell
                                        key={coc.id}
                                        cocId={coc.id}
                                        deId={de.id}
                                    />
                                    // * Keeping this handy for the time being:
                                    // <TableCell
                                    //     key={coc.id}
                                    //     className={styles.tableCell}
                                    // >
                                    //     <DataValue
                                    //         dataValue={getDataValue(
                                    //             de.id,
                                    //             coc.id
                                    //         )}
                                    //     />
                                    // </TableCell>
                                ))}
                            </TableRow>
                        )
                    })}
                {itemsHiddenCnt > 0 && (
                    <TableRow className={styles.hiddenByFilterRow}>
                        <TableCell className="hiddenByFilterCell">
                            {i18n.t('{{count}} items hidden by filter', {
                                count: itemsHiddenCnt,
                            })}
                        </TableCell>
                    </TableRow>
                )}
            </TableBody>

            {tableStyles}
        </Table>
    )
}

CategoryComboTable.propTypes = {
    categoryCombo: PropTypes.shape({
        id: PropTypes.string.isRequired,
    }).isRequired,
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
    filterText: PropTypes.string,
    getDataValue: PropTypes.func,
}
