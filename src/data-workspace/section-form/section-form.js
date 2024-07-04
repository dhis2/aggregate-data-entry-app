import { Tab, TabBar } from '@dhis2/ui'
import cx from 'classnames'
import PropTypes from 'prop-types'
import React from 'react'
import { useSectionFilter } from '../../shared/index.js'
import { SectionFormSection } from './section.js'
import styles from './section.module.css'

const parseDisplayOptions = (displayOptionString) => {
    try {
        return displayOptionString && JSON.parse(displayOptionString)
    } catch (e) {
        console.error(e)
        return undefined
    }
}

export const SectionForm = ({ dataSet, globalFilterText }) => {
    const [sectionId] = useSectionFilter()
    const filteredSections = sectionId
        ? dataSet.sections.filter((s) => s.id === sectionId)
        : dataSet.sections

    const { displayOptions: displayOptionString } = dataSet
    const displayOptions = parseDisplayOptions(displayOptionString)

    if (dataSet.renderAsTabs) {
        return (
            <TabbedSectionForm
                globalFilterText={globalFilterText}
                sections={dataSet.sections}
                dataSetId={dataSet.id}
                direction={displayOptions?.tabsDirection}
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
                    collapsible
                />
            ))}
        </>
    )
}

SectionForm.propTypes = {
    dataSet: PropTypes.shape({
        displayOptions: PropTypes.shape({
            tabsDirection: PropTypes.oneOf(['vertical', 'horizontal']),
        }),
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

const TabbedSectionForm = ({
    dataSetId,
    sections,
    globalFilterText,
    direction,
}) => {
    const [sectionId, setSelectedId] = useSectionFilter()

    const section = sectionId
        ? sections.find((s) => s.id === sectionId)
        : sections[0]

    return (
        <div
            className={cx(styles.sectionTabWrapper, {
                [styles.verticalSectionTabWrapper]: direction === 'vertical',
            })}
        >
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
    direction: PropTypes.oneOf(['vertical', 'horizontal']),
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
