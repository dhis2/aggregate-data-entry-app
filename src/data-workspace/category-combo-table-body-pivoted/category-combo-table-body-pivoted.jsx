import i18n from '@dhis2/d2-i18n'
import { TableRow, TableCell, TableCellHead } from '@dhis2/ui'
import classNames from 'classnames'
import propTypes from 'prop-types'
import React from 'react'
import { useMetadata, selectors } from '../../shared/index.js'
import {
    RowTotal,
    ColumnTotals,
} from '../category-combo-table-body/total-cells.jsx'
import { DataEntryCell, DataEntryField } from '../data-entry-cell/index.js'
import { getFieldId } from '../get-field-id.jsx'
import { TableBodyHiddenByFiltersRow } from '../table-body-hidden-by-filter-row.jsx'
import styles from '../table-body.module.css'
import { generateFormMatrix } from './generate-form-matrix/index.js'

// move this and refactor to reuse from CategoryComboTableBody?
const PaddingCell = () => (
    <TableCell
        className={styles.paddingCell}
        dataTest="dhis2-dataentry-paddingcell"
    ></TableCell>
)

const TotalRow = ({
    dataElements,
    categoryOptionCombos,
    index,
    pivotMode,
    pivotedCategory,
    categories,
}) => {
    const indexAdjustment = pivotMode === 'move_categories' ? 2 : 1
    if (index === 0) {
        return (
            <TableCellHead
                className={styles.totalHeader}
                rowSpan={indexAdjustment}
            >
                {i18n.t('Totals')}
            </TableCellHead>
        )
    }
    if (index === 1 && pivotMode === 'move_categories') {
        return null
    }
    return (
        <RowTotal
            dataElements={dataElements}
            categoryOptionCombos={categoryOptionCombos}
            row={index - indexAdjustment}
            pivotType={pivotMode}
            pivotedCategory={pivotedCategory}
            categories={categories}
        />
    )
}

TotalRow.propTypes = {
    categories: propTypes.array,
    categoryOptionCombos: propTypes.array,
    dataElements: propTypes.array,
    index: propTypes.number,
    pivotMode: propTypes.oneOf(['move_categories', 'pivot', 'none']),
    pivotedCategory: propTypes.string,
}

/**
 * This component is based on the CategoryComboTableBody, and the two should be consolidate eventually.
 * Some of the reasons for the separate component:
 * - data elements are baked into CategoryComboTableBody as rows. With pivoting, we need flexibility in defining what's a row and what's a column that wasn't easy to implement there
 * - This reliance on data elements extends to functionality such as search filters, which is disabled here as we don't have rows of data elements anymore in a pivoted table (they could be columns or rows)
 * - row headers are more complicated in this structure as they can have categories and category options
 *
 * ToDo(pivot): The plan is that - after that pivoting core functionality is finalised - to have a look at both components and consolidate them.
 * https://dhis2.atlassian.net/browse/LIBS-584
 *
 */
export const PivotedCategoryComboTableBody = React.memo(
    function PivotedCategoryComboTableBody({
        categoryCombo,
        dataElements,
        greyedFields,
        filterText,
        globalFilterText,
        renderRowTotals,
        renderColumnTotals,
        maxColumnsInSection,
        displayOptions,
        collapsed,
    }) {
        const { data: metadata } = useMetadata()

        const categories = selectors.getCategoriesByCategoryComboId(
            metadata,
            categoryCombo.id
        )

        const sortedCOCs = selectors.getSortedCoCsByCatComboId(
            metadata,
            categoryCombo.id
        )

        const paddingCells =
            maxColumnsInSection > 0
                ? new Array(maxColumnsInSection - dataElements.length).fill(0)
                : []

        const categoryOptionsDetails = categories
            .map((c) => {
                const headerOptions = selectors.getCategoryOptionsByCategoryId(
                    metadata,
                    c.id
                )
                return [...headerOptions]
            })
            .flat()

        const filterCOCBySearch = (elementName) => {
            const search =
                displayOptions.pivotMode !== 'move_categories' &&
                filterText.toLowerCase()
            return search ? elementName.toLowerCase().includes(search) : true
        }

        const filterDataElementsBySearch = (elementName) => {
            // local search should always work on rows - so disable localSearch when transposed (filterCOCBySearch would do the filter)
            const localSearch =
                displayOptions.pivotMode === 'move_categories' &&
                filterText.toLowerCase()
            const globalSearch = globalFilterText.toLowerCase()
            return localSearch || globalSearch
                ? (localSearch &&
                      elementName.toLowerCase().includes(localSearch)) ||
                      (globalSearch &&
                          elementName.toLowerCase().includes(globalSearch))
                : true
        }

        const filteredDataElements = dataElements.filter((de) =>
            filterDataElementsBySearch(de.displayFormName)
        )
        const filteredSortedCOCS = sortedCOCs.filter((coc) =>
            filterCOCBySearch(coc.displayName)
        )

        const options = {
            metadata,
            categoryOptionsDetails,
            sortedCOCs: filteredSortedCOCS,
            totalRows: sortedCOCs.length,
            categories,
            dataElements: filteredDataElements,
        }

        const rowsMatrix = generateFormMatrix(options, displayOptions)

        const hiddenItemsCount =
            displayOptions.pivotMode === 'move_categories'
                ? dataElements.length - filteredDataElements.length
                : sortedCOCs.length - filteredSortedCOCS.length

        return (
            <>
                {rowsMatrix.map((row, index /** todo: find suitable id */) => {
                    return (
                        <TableRow
                            key={index}
                            className={classNames({
                                [styles.sectionRowCollapsed]: collapsed,
                            })}
                        >
                            {row.map((fieldInRow) => {
                                if (
                                    fieldInRow.type === 'columnHeader' ||
                                    fieldInRow.type === 'rowHeader'
                                ) {
                                    return (
                                        <TableCellHead
                                            key={fieldInRow.id}
                                            className={classNames(
                                                [
                                                    styles.pivotedHeader,
                                                    styles.noWrap,
                                                    styles[
                                                        fieldInRow.metadataType
                                                    ],
                                                ],
                                                {
                                                    [styles.dataElementRowHeader]:
                                                        fieldInRow.metadataType ===
                                                        'dataElement',
                                                }
                                            )}
                                            colSpan={fieldInRow.colSpan?.toString()}
                                            rowSpan={fieldInRow.rowSpan?.toString()}
                                        >
                                            {fieldInRow.name !== 'default' &&
                                                fieldInRow.displayFormName}
                                        </TableCellHead>
                                    )
                                }

                                if (fieldInRow.type === 'empty') {
                                    return (
                                        <TableCell
                                            className={[
                                                styles.categoryNameHeader,
                                                styles.noWrap,
                                            ]}
                                            key={fieldInRow.id}
                                            colSpan={fieldInRow.colSpan?.toString()}
                                            rowSpan={fieldInRow.rowSpan?.toString()}
                                        />
                                    )
                                }

                                if (fieldInRow.type === 'de') {
                                    return (
                                        <DataEntryCell key={fieldInRow.id}>
                                            <DataEntryField
                                                dataElement={
                                                    fieldInRow.dataElement
                                                }
                                                categoryOptionCombo={
                                                    fieldInRow.coc
                                                }
                                                disabled={greyedFields?.has(
                                                    getFieldId(
                                                        fieldInRow.dataElement
                                                            .id,
                                                        fieldInRow.coc.id
                                                    )
                                                )}
                                            />
                                        </DataEntryCell>
                                    )
                                }
                                // should never get here
                                return <>unsupported field</>
                            })}
                            {paddingCells.map((_, i) => (
                                <PaddingCell
                                    key={`total_replacement_padding_row_${i}`}
                                />
                            ))}
                            {renderRowTotals && (
                                <TotalRow
                                    dataElements={dataElements}
                                    categoryOptionCombos={sortedCOCs}
                                    index={index}
                                    pivotMode={displayOptions.pivotMode}
                                    pivotedCategory={
                                        displayOptions?.pivotedCategory
                                    }
                                    categories={categories}
                                />
                            )}
                        </TableRow>
                    )
                })}
                {renderColumnTotals && (
                    <ColumnTotals
                        paddingCells={paddingCells}
                        initialColumns={categories.length}
                        renderTotalSum={renderRowTotals && renderColumnTotals}
                        dataElements={dataElements}
                        categoryOptionCombos={sortedCOCs}
                        pivotType={displayOptions.pivotMode}
                        pivotedCategory={displayOptions.pivotedCategory}
                        categories={categories}
                    />
                )}
                {hiddenItemsCount > 0 && (
                    <TableBodyHiddenByFiltersRow
                        hiddenItemsCount={hiddenItemsCount}
                    />
                )}
            </>
        )
    }
)

PivotedCategoryComboTableBody.propTypes = {
    categoryCombo: propTypes.shape({
        id: propTypes.string.isRequired,
    }),
    collapsed: propTypes.bool,
    dataElements: propTypes.arrayOf(
        propTypes.shape({
            id: propTypes.string.isRequired,
            displayFormName: propTypes.string,
            headerCombo: propTypes.shape({
                id: propTypes.string,
            }),
            valueType: propTypes.string,
        })
    ),
    displayOptions: propTypes.shape({
        afterSectionText: propTypes.string,
        beforeSectionText: propTypes.string,
        pivotMode: propTypes.oneOf(['move_categories', 'pivot']),
        pivotedCategory: propTypes.string,
    }),
    filterText: propTypes.string,
    /** Greyed fields is a Set where .has(fieldId) is true if that field is greyed/disabled */
    globalFilterText: propTypes.string,
    greyedFields: propTypes.instanceOf(Set),
    maxColumnsInSection: propTypes.number,
    renderColumnTotals: propTypes.bool,
    renderRowTotals: propTypes.bool,
}
