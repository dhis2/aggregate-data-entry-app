import { TableBody, TableRow, TableCell } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { useCallback } from 'react'
import useRightHandPanelContext from '../../right-hand-panel/use-right-hand-panel-context.js'
import {
    useMetadata,
    selectors,
    useHighlightedFieldIdContext,
} from '../../shared/index.js'
import { DataEntryCell, DataEntryField } from '../data-entry-cell/index.js'
import { getFieldId } from '../get-field-id.js'
import { TableBodyHiddenByFiltersRow } from '../table-body-hidden-by-filter-row.js'
import styles from '../table-body.module.css'
import { CategoryComboTableBodyHeader } from './category-combo-table-body-header.js'
import { DataElementCell } from './data-element-cell.js'
import { ColumnTotals, RowTotal } from './total-cells.js'

export const CategoryComboTableBody = React.memo(
    function CategoryComboTableBody({
        categoryCombo,
        dataElements,
        filterText,
        globalFilterText,
        greyedFields,
        maxColumnsInSection,
        renderRowTotals,
        renderColumnTotals,
    }) {
        const { data: metadata } = useMetadata()

        // const { item } = useHighlightedFieldIdContext()
        // const { id } = useRightHandPanelContext()
        // const isRightHandPanelVisible = !!id

        const keptInFocus = useCallback(
            (deId, cocId) =>
                false
            []
        )

        const categories = selectors.getCategoriesByCategoryComboId(
            metadata,
            categoryCombo.id
        )

        const sortedCOCs = selectors.getSortedCoCsByCatComboId(
            metadata,
            categoryCombo.id
        )

        const checkTableActive = useCallback(
            (activeDeId) => dataElements.some(({ id }) => id === activeDeId),
            [dataElements]
        )

        const paddingCells = React.useMemo(
            () =>
                maxColumnsInSection > 0
                    ? new Array(maxColumnsInSection - sortedCOCs.length).fill(0)
                    : [],
            [maxColumnsInSection, sortedCOCs.length]
        )

        const filteredDataElements = dataElements.filter((de) => {
            const name = de.displayFormName.toLowerCase()
            return (
                (!filterText || name.includes(filterText.toLowerCase())) &&
                (!globalFilterText ||
                    name.includes(globalFilterText.toLowerCase()))
            )
        })
        const hiddenItemsCount =
            dataElements.length - filteredDataElements.length

        return (
            <TableBody>
                <CategoryComboTableBodyHeader
                    categoryOptionCombos={sortedCOCs}
                    categories={categories}
                    renderRowTotals={renderRowTotals}
                    paddingCells={paddingCells}
                    checkTableActive={checkTableActive}
                />
                {filteredDataElements.map((de, i) => {
                    return (
                        <DataElementRow
                            key={de.id}
                            de={de}
                            sortedCOCs={sortedCOCs}
                            greyedFields={greyedFields}
                            keptInFocus={keptInFocus}
                            paddingCells={paddingCells}
                            renderRowTotals={renderRowTotals}
                            dataElements={dataElements}
                            i={i}
                        />
                    )
                })}
                {renderColumnTotals && (
                    <ColumnTotals
                        paddingCells={paddingCells}
                        renderTotalSum={renderRowTotals && renderColumnTotals}
                        dataElements={dataElements}
                        categoryOptionCombos={sortedCOCs}
                    />
                )}
                {hiddenItemsCount > 0 && (
                    <TableBodyHiddenByFiltersRow
                        hiddenItemsCount={hiddenItemsCount}
                    />
                )}
            </TableBody>
        )
    }
)

const DataElementRow = React.memo(function DataElementRow({
    de,
    sortedCOCs,
    greyedFields,
    keptInFocus,
    paddingCells,
    renderRowTotals,
    dataElements,
    i,
}) {
    return (
        <>
            <TableRow>
                <DataElementCell dataElement={de} />
                {sortedCOCs.map((coc) => (
                    <DataEntryField
                        key={coc.id}
                        dataElement={de}
                        categoryOptionCombo={coc}
                        disabled={greyedFields?.has(getFieldId(de.id, coc.id))}
                        keptInFocus={keptInFocus(de.id, coc.id)}
                    />
                ))}
                {paddingCells.map((_, i) => (
                    <PaddingCell key={i} className={styles.tableCell} />
                ))}
                {renderRowTotals && (
                    <RowTotal
                        dataElements={dataElements}
                        categoryOptionCombos={sortedCOCs}
                        row={i}
                    />
                )}
            </TableRow>
        </>
    )
})
DataElementRow.propTypes = {
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

    de: PropTypes.shape({
        id: PropTypes.string.isRequired,
        categoryCombo: PropTypes.shape({
            id: PropTypes.string,
        }),
        displayFormName: PropTypes.string,
        valueType: PropTypes.string,
    }),

    /** Greyed fields is a Set where .has(fieldId) is true if that field is greyed/disabled */
    greyedFields: PropTypes.instanceOf(Set),
    i: PropTypes.number,
    keptInFocus: PropTypes.bool,
    paddingCells: PropTypes.any,
    renderRowTotals: PropTypes.bool,
    sortedCOCs: PropTypes.any,
}
CategoryComboTableBody.propTypes = {
    categoryCombo: PropTypes.shape({
        id: PropTypes.string.isRequired,
        categoryOptionCombos: PropTypes.array,
    }),
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
    /** Greyed fields is a Set where .has(fieldId) is true if that field is greyed/disabled */
    greyedFields: PropTypes.instanceOf(Set),
    maxColumnsInSection: PropTypes.number,
    renderColumnTotals: PropTypes.bool,
    renderRowTotals: PropTypes.bool,
}

const PaddingCell = () => <TableCell className={styles.paddingCell}></TableCell>
