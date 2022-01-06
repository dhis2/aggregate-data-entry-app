import {
    Table,
    TableRowHead,
    TableHead,
    TableCellHead,
    TableBody,
    TableRow,
    TableCell,
} from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import styles from './data-table.module.css'
import { useMetadata } from './metadata-context.js'
import {
    getCategoriesByCategoryComboId,
    getCategoryOptionsByCategoryId,
    getCoCByCategoryOptions,
} from './selectors.js'
import { cartesian } from './utils.js'

const DataValue = ({ dataValue }) => {
    return <span>{dataValue ? dataValue.value : null}</span>
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
                                        <DataValue
                                            dataValue={getDataValue(
                                                de.id,
                                                coc.id
                                            )}
                                        />
                                    </TableCell>
                                ))}
                            </TableRow>
                        )
                    })}
            </TableBody>
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
