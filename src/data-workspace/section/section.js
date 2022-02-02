import i18n from '@dhis2/d2-i18n'
import {
    colors,
    IconFilter16,
    Table,
    TableCellHead,
    TableHead,
    TableRowHead,
} from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { useState, useMemo } from 'react'
import { useMetadata } from '../../metadata/index.js'
import {
    getDataElementsBySection,
    groupDataElementsByCatCombo,
    groupDataElementsByCatComboInOrder,
} from '../../metadata/selectors.js'
import { CategoryComboTable } from '../category-combo-table.js'
import styles from './section.module.css'

export const SectionFormSection = ({ section, globalFilterText }) => {
    // Could potentially build table via props instead of rendering children
    const [filterText, setFilterText] = useState('')
    const { available, metadata } = useMetadata()

    if (!available) {
        return null
    }

    const [groupedDataElements, maxColumnsInSection] = useMemo(() => {
        const dataElements = getDataElementsBySection(
            metadata,
            section.dataSet.id,
            section.id
        )
        const groupedDataElements = section.disableDataElementAutoGroup
            ? groupDataElementsByCatComboInOrder(metadata, dataElements)
            : groupDataElementsByCatCombo(metadata, dataElements)

        const maxColumnsInSection = Math.max(
            ...groupedDataElements.map(
                (grp) => grp.categoryCombo.categoryOptionCombos.length
            )
        )
        return [groupedDataElements, maxColumnsInSection]
    }, [metadata, section])

    const filterInputId = `filter-input-${section.id}`

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
                    <TableCellHead colSpan="100%" className={styles.headerCell}>
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
                <CategoryComboTable
                    key={i} //if disableDataElementAutoGroup then duplicate catCombo-ids, so have to use index
                    categoryCombo={categoryCombo}
                    dataElements={dataElements}
                    filterText={filterText}
                    globalFilterText={globalFilterText}
                    maxColumnsInSection={maxColumnsInSection}
                />
            ))}
        </Table>
    )
}
const sectionProps = PropTypes.shape({
    dataSet: PropTypes.shape({
        id: PropTypes.string,
    }),
    description: PropTypes.string,
    disableDataElementAutoGroup: PropTypes.bool,
    displayName: PropTypes.string,
    id: PropTypes.string,
})

SectionFormSection.propTypes = {
    globalFilterText: PropTypes.string,
    section: sectionProps,
}
