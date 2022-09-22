import { Tab, TabBar } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import { useSectionFilter } from '../../shared/index.js'
import { SectionFormSection } from './section.js'
import styles from './section.module.css'

export const SectionForm = ({ dataSet, globalFilterText }) => {
    const [sectionId] = useSectionFilter()
    const sectionsMatchingFilter = dataSet.sections.filter(
        (s) => s.id === sectionId
    )
    const filteredSections =
        sectionId && sectionsMatchingFilter?.length > 0
            ? sectionsMatchingFilter
            : dataSet.sections

    if (dataSet.renderAsTabs) {
        return (
            <TabbedSectionForm
                globalFilterText={globalFilterText}
                sections={dataSet.sections}
                dataSetId={dataSet.id}
            />
        )
    }

    return (
        <>
            {filteredSections.map((s) => (
                <SectionFormSection
                    section={s}
                    dataSetId={dataSet.id}
                    key={s.id}
                    globalFilterText={globalFilterText}
                />
            ))}
        </>
    )
}

SectionForm.propTypes = {
    dataSet: PropTypes.shape({
        id: PropTypes.string,
        renderAsTabs: PropTypes.bool,
        sections: PropTypes.arrayOf(
            PropTypes.shape({
                dataSet: PropTypes.shape({
                    id: PropTypes.string,
                }),
                description: PropTypes.string,
                disableDataElementAutoGroup: PropTypes.bool,
                displayName: PropTypes.string,
                id: PropTypes.string,
            })
        ),
    }),
    globalFilterText: PropTypes.string,
}

const TabbedSectionForm = ({ dataSetId, sections, globalFilterText }) => {
    const [sectionId, setSelectedId] = useSectionFilter()
    const sectionsMatchingFilter = sections.filter((s) => s.id === sectionId)

    const section =
        sectionId && sectionsMatchingFilter?.length > 0
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
                dataSetId={dataSetId}
                key={section.id}
                globalFilterText={globalFilterText}
            />
        </div>
    )
}

TabbedSectionForm.propTypes = {
    dataSetId: PropTypes.string,
    globalFilterText: PropTypes.string,
    sections: PropTypes.arrayOf(
        PropTypes.shape({
            dataSet: PropTypes.shape({
                id: PropTypes.string,
            }),
            description: PropTypes.string,
            disableDataElementAutoGroup: PropTypes.bool,
            displayName: PropTypes.string,
            id: PropTypes.string,
        })
    ),
}
