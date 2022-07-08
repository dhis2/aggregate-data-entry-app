import { Table, TableCellHead, TableHead, TableRowHead } from '@dhis2/ui'
import classNames from 'classnames'
import PropTypes from 'prop-types'
import React, { useState } from 'react'
import { useMetadata, selectors } from '../../metadata/index.js'
import { useDebounce } from '../../shared/index.js'
import { CategoryComboTable } from '../category-combo-table/index.js'
import { getFieldId } from '../get-field-id.js'
import { SectionFilter } from './section-filter.js'
import styles from './section.module.css'

export const SectionFormSection = ({
    section,
    dataSetId,
    globalFilterText,
}) => {
    // Could potentially build table via props instead of rendering children
    const [filterText, setFilterText] = useState('')
    const debouncedSetFilterText = useDebounce(setFilterText, 200)
    const { data } = useMetadata()

    if (!data) {
        return null
    }

    const dataElements = selectors.getDataElementsBySection(
        data,
        dataSetId,
        section.id
    )
    const groupedDataElements = section.disableDataElementAutoGroup
        ? selectors.getGroupedDataElementsByCatComboInOrder(data, dataElements)
        : selectors.getGroupedDataElementsByCatCombo(data, dataElements)

    const maxColumnsInSection = Math.max(
        ...groupedDataElements.map(
            (grp) => grp.categoryCombo.categoryOptionCombos?.length || 1
        )
    )

    const greyedFields = new Set(
        section.greyedFields.map((greyedField) =>
            getFieldId(
                greyedField.dataElement.id,
                greyedField.categoryOptionCombo.id
            )
        )
    )

    const filterInputId = `filter-input-${section.id}`
    const headerCellStyles = classNames(styles.headerCell, 'hide-for-print')

    return (
        <Table className={styles.table} suppressZebraStriping>
            <TableHead>
                <TableRowHead>
                    <TableCellHead colSpan="100%" className={styles.headerCell}>
                        <div className={styles.labelWrapper}>
                            <div className={styles.title}>
                                {section.displayName}
                            </div>
                            {section.description && (
                                <div className={styles.description}>
                                    {section.description ||
                                        'Placeholder section description'}
                                </div>
                            )}
                        </div>
                    </TableCellHead>
                </TableRowHead>
                <TableRowHead>
                    <TableCellHead colSpan="100%" className={headerCellStyles}>
                        <SectionFilter
                            id={filterInputId}
                            onFilterChange={debouncedSetFilterText}
                        />
                    </TableCellHead>
                </TableRowHead>
            </TableHead>
            {groupedDataElements.map(({ categoryCombo, dataElements }, i) => (
                <CategoryComboTable
                    key={i} //if disableDataElementAutoGroup then duplicate catCombo-ids, so have to use index
                    categoryCombo={categoryCombo}
                    dataElements={dataElements}
                    filterText={filterText}
                    globalFilterText={globalFilterText}
                    maxColumnsInSection={maxColumnsInSection}
                    renderRowTotals={section.showRowTotals}
                    renderColumnTotals={section.showColumnTotals}
                    greyedFields={greyedFields}
                />
            ))}
        </Table>
    )
}

SectionFormSection.propTypes = {
    dataSetId: PropTypes.string,
    globalFilterText: PropTypes.string,
    section: PropTypes.shape({
        dataSet: PropTypes.shape({
            id: PropTypes.string,
        }),
        description: PropTypes.string,
        disableDataElementAutoGroup: PropTypes.bool,
        displayName: PropTypes.string,
        greyedFields: PropTypes.array,
        id: PropTypes.string,
        showColumnTotals: PropTypes.bool,
        showRowTotals: PropTypes.bool,
    }),
}
