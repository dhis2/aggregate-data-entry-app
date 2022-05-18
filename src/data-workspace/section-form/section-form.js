import { Tab, TabBar } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import { useSectionFilter } from '../../context-selection/use-context-selection/use-context-selection.js'
import { SectionFormSection } from './section.js'
import styles from './section.module.css'

export const SectionForm = ({ dataSet, globalFilterText, onFocus }) => {
    const [sectionId] = useSectionFilter()
    const filteredSections = sectionId
        ? dataSet.sections.filter((s) => s.id === sectionId)
        : dataSet.sections

    if (dataSet.renderAsTabs) {
        return (
            <TabbedSectionForm
                globalFilterText={globalFilterText}
                sections={dataSet.sections}
                dataSetId={dataSet.id}
                onFocus={onFocus}
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
                    onFocus={onFocus}
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
    onFocus: PropTypes.func,
}

const TabbedSectionForm = ({
    dataSetId,
    sections,
    globalFilterText,
    onFocus,
}) => {
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
                dataSetId={dataSetId}
                key={section.id}
                globalFilterText={globalFilterText}
                onFocus={onFocus}
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
    onFocus: PropTypes.func,
}
