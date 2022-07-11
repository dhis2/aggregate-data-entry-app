import i18n from '@dhis2/d2-i18n'
import {
    colors,
    IconFilter16,
    Table,
    TableCellHead,
    TableHead,
    TableRowHead,
} from '@dhis2/ui'
import classNames from 'classnames'
import PropTypes from 'prop-types'
import React, { useState } from 'react'
import { useMetadata, selectors } from '../../metadata/index.js'
import { CategoryComboTableBody } from '../category-combo-table-body/index.js'
import { getFieldId } from '../get-field-id.js'
import { IndicatorsTableBody } from '../indicators-table-body/indicators-table-body.js'
import styles from './section.module.css'

export const SectionFormSection = ({
    section,
    dataSetId,
    globalFilterText,
}) => {
    // Could potentially build table via props instead of rendering children
    const [filterText, setFilterText] = useState('')
    const { data } = useMetadata()

    if (!data) {
        return null
    }

    const dataElements = selectors.getDataElementsBySection(
        data,
        dataSetId,
        section.id
    )
    const indicators = selectors.getIndicatorsBySection(
        data,
        dataSetId,
        section.id
    )
    const groupedDataElements = section.disableDataElementAutoGroup
        ? selectors.getGroupedDataElementsByCatComboInOrder(data, dataElements)
        : selectors.getGroupedDataElementsByCatCombo(data, dataElements)

    // calculate how many columns in each group
    const groupedTotalColumns = groupedDataElements.map((grp) =>
        (
            selectors
                .getCategoriesByCategoryComboId(data, grp.categoryCombo.id)
                ?.map((cat) => cat.categoryOptions.length) || [1]
        ).reduce((total, curr) => total * curr)
    )

    const maxColumnsInSection = Math.max(...groupedTotalColumns)

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
                        <label
                            htmlFor={filterInputId}
                            className={styles.filterWrapper}
                        >
                            <IconFilter16 color={colors.grey600} />
                            <input
                                name={filterInputId}
                                id={filterInputId}
                                type="text"
                                placeholder={i18n.t(
                                    'Type here to filter in this section'
                                )}
                                value={filterText}
                                onChange={({ target }) =>
                                    setFilterText(target.value)
                                }
                                className={styles.filterInput}
                            />
                        </label>
                    </TableCellHead>
                </TableRowHead>
            </TableHead>
            {groupedDataElements.map(({ categoryCombo, dataElements }, i) => (
                <CategoryComboTableBody
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
            {indicators.length > 0 && (
                <IndicatorsTableBody
                    indicators={indicators}
                    maxColumnsInSection={maxColumnsInSection}
                    filterText={filterText}
                    globalFilterText={globalFilterText}
                />
            )}
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
