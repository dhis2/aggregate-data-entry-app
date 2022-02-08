import { Tab, TabBar } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import { useSectionFilter } from '../../context-selection/use-context-selection/use-context-selection.js'
import { SectionFormSection, sectionProps } from './section.js'
import styles from './section.module.css'

export const SectionForm = ({ dataSet, globalFilterText }) => {
    const [sectionId] = useSectionFilter()
    const filteredSections = sectionId
        ? dataSet.sections.filter((s) => s.id === sectionId)
        : dataSet.sections

    if (dataSet.renderAsTabs) {
        return (
            <TabbedSectionForm
                globalFilterText={globalFilterText}
                sections={dataSet.sections}
            />
        )
    }

    return (
        <>
            {filteredSections.map((s) => (
                <SectionFormSection
                    section={s}
                    key={s.id}
                    globalFilterText={globalFilterText}
                />
            ))}
        </>
    )
}

SectionForm.propTypes = {
    dataSet: PropTypes.shape({
        renderAsTabs: PropTypes.bool,
        sections: PropTypes.arrayOf(sectionProps),
    }),
    globalFilterText: PropTypes.string,
}

const TabbedSectionForm = ({ sections, globalFilterText }) => {
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

            <SectionFormSection
                section={section}
                key={section.id}
                globalFilterText={globalFilterText}
            />
        </div>
    )
}

TabbedSectionForm.propTypes = {
    globalFilterText: PropTypes.string,
    sections: PropTypes.arrayOf(sectionProps),
}
