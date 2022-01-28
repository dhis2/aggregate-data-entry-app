import i18n from '@dhis2/d2-i18n'
import {
    colors,
    IconFilter16,
    Table,
    TableCellHead,
    TableHead,
    TableRowHead,
    Tab,
    TabBar,
} from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { useState, useMemo } from 'react'
import { useSectionFilter } from '../context-selection/use-context-selection/use-context-selection.js'
import { useMetadata } from '../metadata/index.js'
import {
    getDataElementsBySection,
    groupDataElementsByCatCombo,
    groupDataElementsByCatComboInOrder,
} from '../metadata/selectors.js'
import { CategoryComboTable } from './category-combo-table.js'
import styles from './section.module.css'

export const FormSection = ({ section, globalFilterText }) => {
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
            {groupedDataElements.map(({ categoryCombo, dataElements }) => (
                <CategoryComboTable
                    key={categoryCombo.id}
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

FormSection.propTypes = {
    globalFilterText: PropTypes.string,
    section: sectionProps,
}

export const SectionForms = ({ dataSet, globalFilterText }) => {
    const [sectionId] = useSectionFilter()
    const filteredSections = sectionId
        ? dataSet.sections.filter((s) => s.id === sectionId)
        : dataSet.sections

    if (dataSet.renderAsTabs) {
        return (
            <TabbedSectionForms
                globalFilterText={globalFilterText}
                sections={dataSet.sections}
            />
        )
    }

    return (
        <>
            {filteredSections.map((s) => (
                <FormSection
                    section={s}
                    key={s.id}
                    globalFilterText={globalFilterText}
                />
            ))}
        </>
    )
}

SectionForms.propTypes = {
    dataSet: PropTypes.shape({
        renderAsTabs: PropTypes.bool,
        sections: PropTypes.arrayOf(sectionProps),
    }),
    globalFilterText: PropTypes.string,
}

const TabbedSectionForms = ({ sections, globalFilterText }) => {
    const [sectionId, setSelectedId] = useSectionFilter()

    const section = sectionId
        ? sections.find((s) => s.id === sectionId)
        : sections[0]

    return (
        <div>
            <TabBar className={styles.sectionTab}>
                {sections.map((s) => (
                    <Tab
                        key={s.id}
                        selected={s.id === section.id}
                        onClick={() => setSelectedId(s.id)}
                    >
                        {s.displayName}
                    </Tab>
                ))}
            </TabBar>

            <FormSection
                section={section}
                key={section.id}
                globalFilterText={globalFilterText}
            />
        </div>
    )
}

TabbedSectionForms.propTypes = {
    globalFilterText: PropTypes.string,
    sections: PropTypes.arrayOf(sectionProps),
}
