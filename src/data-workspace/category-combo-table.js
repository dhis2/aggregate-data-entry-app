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
import { useMetadata } from '../metadata/index.js'
import {
    getCategoriesByCategoryComboId,
    getCategoryOptionsByCategoryId,
    getCoCByCategoryOptions,
} from '../metadata/selectors.js'
import { cartesian } from '../shared/utils.js'
import styles from './category-combo-table.module.css'
import { DataEntryCell, useActiveCell } from './data-entry-cell/index.js'

export const CategoryComboTable = ({
    categoryCombo,
    dataElements,
    filterText,
    globalFilterText,
    maxColumnsInSection,
}) => {
    const { isLoading, isError, data } = useMetadata()
    const { deId: activeDeId, cocId: activeCocId } = useActiveCell()

    if (isLoading || isError) {
        return null
    }

    const categories = getCategoriesByCategoryComboId(data, categoryCombo.id)

    // each element is a combination of category-options for a particular column
    // this results in lists of category-options in the same order as headers are rendered
    // the result is a client side computation of categoryOption-combinations
    const optionsIdLists = categories.map((cat) => cat.categoryOptions)
    const computedCategoryOptions = cartesian(optionsIdLists)

    if (
        computedCategoryOptions.length !==
        categoryCombo.categoryOptionCombos.length
    ) {
        console.warn(
            `Computed combination of categoryOptions for catCombo(${categoryCombo.id}) is different from server. 
            Please regenerate categoryOptionCombos. 
            Computed: ${computedCategoryOptions.length}
            Server: ${categoryCombo.categoryOptionCombos.length})`
        )
    }
    // Computes the span and repeats for each columns in a category-row.
    // Repeats are the number of times the options in a category needs to be rendered per category-row
    let catColSpan = computedCategoryOptions.length
    const rowToColumnsMap = categories.map((c) => {
        const categoryOptions = getCategoryOptionsByCategoryId(data, c.id)
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
            getCoCByCategoryOptions(data, categoryCombo.id, options)
        )
        .filter((coc) => !!coc)

    const renderPaddedCells =
        maxColumnsInSection > 0
            ? new Array(maxColumnsInSection - sortedCOCs.length).fill(0)
            : []

    const filteredDataElements = dataElements.filter((de) => {
        const name = de.displayFormName.toLowerCase()
        return (
            (!filterText || name.includes(filterText.toLowerCase())) &&
            (!globalFilterText || name.includes(globalFilterText.toLowerCase()))
        )
    })
    const itemsHiddenCnt = dataElements.length - filteredDataElements.length

    // Is the active cell in this cat-combo table? Check to see if active
    // data element is in this CCT
    const isThisTableActive = dataElements.some(({ id }) => id === activeDeId)

    // Find if this column header includes the active cell's column
    const isHeaderActive = (headerIdx, headerColSpan) => {
        const activeCellColIdx = sortedCOCs.findIndex(
            (coc) => activeCocId === coc.id
        )
        const idxDiff = activeCellColIdx - headerIdx * headerColSpan
        return isThisTableActive && idxDiff < headerColSpan && idxDiff >= 0
    }

    return (
        <TableBody>
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
                                    className={cx(styles.tableHeader, {
                                        [styles.active]: isHeaderActive(
                                            i,
                                            span
                                        ),
                                    })}
                                    colSpan={span.toString()}
                                >
                                    {co.isDefault
                                        ? 'Value'
                                        : co.displayFormName}
                                </TableCellHead>
                            )
                        })}
                        {renderPaddedCells.map((_, i) => (
                            <PaddingCell key={i} />
                        ))}
                    </TableRowHead>
                )
            })}
            {filteredDataElements.map((de) => {
                return (
                    <TableRow key={de.id}>
                        <TableCell
                            className={cx(styles.dataElementName, {
                                [styles.active]: de.id === activeDeId,
                            })}
                        >
                            {de.displayFormName}
                        </TableCell>
                        {sortedCOCs.map((coc) => (
                            <DataEntryCell
                                key={coc.id}
                                dataElement={de}
                                categoryOptionCombo={coc}
                            />
                        ))}
                        {renderPaddedCells.map((_, i) => (
                            <PaddingCell key={i} className={styles.tableCell} />
                        ))}
                    </TableRow>
                )
            })}
            {itemsHiddenCnt > 0 && (
                <TableRow>
                    <TableCell
                        className={styles.hiddenByFilterCell}
                        colSpan="100%"
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

CategoryComboTable.propTypes = {
    categoryCombo: PropTypes.shape({
        id: PropTypes.string.isRequired,
        categoryOptionCombos: PropTypes.array,
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
    globalFilterText: PropTypes.string,
    maxColumnsInSection: PropTypes.number,
}

const PaddingCell = () => <TableCell className={styles.paddingCell}></TableCell>
