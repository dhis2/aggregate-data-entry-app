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
import React, { useContext, useState } from 'react'
import { useSectionFilter } from '../context-selection/use-context-selection/use-context-selection.js'
import { CategoryComboTable } from './category-combo-table.js'
import { MetadataContext } from './metadata-context.js'
import styles from './section.module.css'
import {
    getDataElementsBySection,
    groupDataElementsByCatCombo,
    groupDataElementsByCatComboInOrder,
} from './selectors.js'

export const FormSection = ({ section, getDataValue, globalFilterText }) => {
    // Could potentially build table via props instead of rendering children
    const [filterText, setFilterText] = useState('')
    const { metadata } = useContext(MetadataContext)

    if (!Object.keys(metadata).length) {
        return 'Loading metadata'
    }

    const dataElements = getDataElementsBySection(
        metadata,
        section.dataSet.id,
        section.id
    )

    const groupedDataElements = section.disableDataElementAutoGroup
        ? groupDataElementsByCatComboInOrder(metadata, dataElements)
        : groupDataElementsByCatCombo(metadata, dataElements)
    console.log(groupedDataElements)

    const maxColumnsInSection = Math.max(
        ...groupedDataElements.map(
            (grp) => grp.categoryCombo.categoryOptionCombos.length
        )
    )

    return (
        <div className="wrapper">
            <Table className={styles.table}>
                <TableHead>
                    <TableRowHead>
                        <TableCellHead colSpan="100%" className={styles.header}>
                            <div className={styles.title}>
                                {section.displayName}
                            </div>
                            {section.description && (
                                <div className={styles.description}>
                                    {section.description ||
                                        'Placeholder section description'}
                                </div>
                            )}
                        </TableCellHead>
                    </TableRowHead>
                    <TableRowHead>
                        <TableCellHead colSpan="100%" className={styles.filter}>
                            <IconFilter16 color={colors.grey600} />
                            <input
                                name="filter-input"
                                type="text"
                                placeholder={i18n.t(
                                    'Type here to filter in this section'
                                )}
                                value={filterText}
                                onChange={({ target }) =>
                                    setFilterText(target.value)
                                }
                            />
                        </TableCellHead>
                    </TableRowHead>
                </TableHead>
                {groupedDataElements.map(({ categoryCombo, dataElements }) => (
                    <CategoryComboTable
                        key={categoryCombo.id}
                        categoryCombo={categoryCombo}
                        dataElements={dataElements}
                        getDataValue={getDataValue}
                        filterText={filterText}
                        globalFilterText={globalFilterText}
                        maxColumnsInSection={maxColumnsInSection}
                    />
                ))}
            </Table>
        </div>
    )
}
FormSection.propTypes = {
    section: PropTypes.shape({
        description: PropTypes.string,
        disableDataElementAutoGroup: PropTypes.bool,
        displayName: PropTypes.string,
    }),
}

export const SectionForms = ({ dataSet, getDataValue, globalFilterText }) => {
    const [sectionId] = useSectionFilter()
    const filteredSections = sectionId
        ? dataSet.sections.filter((s) => s.id === sectionId)
        : dataSet.sections
    return (
        <div>
            {filteredSections.map((s) => (
                <FormSection
                    section={s}
                    key={s.id}
                    getDataValue={getDataValue}
                    globalFilterText={globalFilterText}
                />
            ))}
        </div>
    )
}
