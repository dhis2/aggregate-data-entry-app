import i18n from '@dhis2/d2-i18n'
import { SelectorBarItem } from '@dhis2/ui'
import React, { useCallback, useState, useEffect } from 'react'
import {
    selectors,
    useMetadata,
    useDataSetId,
    useSectionFilter,
} from '../../shared/index.js'
import { MenuSelect } from '../menu-select/index.js'
import useOnDependentParamsChange from './use-on-dependent-params-change.js'
import useSelectorBarItemValue from './use-selector-bar-item-value.js'
import useShouldComponentRenderNull from './use-should-component-render-null.js'

export default function SectionFilterSelectorBarItem() {
    const [open, setOpen] = useState(false)
    const [sectionFilter, setSectionFilter] = useSectionFilter()
    const deselect = useCallback(
        () => setSectionFilter(undefined),
        [setSectionFilter]
    )
    const { data: metadata } = useMetadata()
    const [dataSetId] = useDataSetId()
    const dataSet = selectors.getDataSetById(metadata, dataSetId)
    const sectionFilterValue = useSelectorBarItemValue()

    useOnDependentParamsChange(deselect)

    useEffect(() => {
        const sections = dataSet?.sections
        if (sectionFilter === undefined && sections?.length) {
            setSectionFilter(sections[0].id)
        }
        // clear out section if it is invalid
        if (
            sections &&
            sectionFilter &&
            !sections.map(({ id }) => id).includes(sectionFilter)
        ) {
            setSectionFilter(undefined)
        }
    }, [dataSet, sectionFilter, setSectionFilter])

    const shouldComponentRenderNull = useShouldComponentRenderNull()
    if (shouldComponentRenderNull) {
        return null
    }

    const sectionOptions =
        dataSet?.sections.map(({ id, displayName }) => ({
            value: id,
            label: displayName,
        })) || []

    const selectableOptions = dataSet?.renderAsTabs
        ? sectionOptions
        : [...sectionOptions, { value: null, label: i18n.t('All sections') }]

    return (
        <div data-test="section-filter-selector">
            <SelectorBarItem
                label={i18n.t('Section')}
                value={sectionFilterValue}
                open={open}
                setOpen={setOpen}
                noValueMessage={i18n.t('All sections')}
            >
                <MenuSelect
                    values={selectableOptions}
                    selected={sectionFilter}
                    onChange={({ selected }) => {
                        setSectionFilter(selected)
                        setOpen(false)
                    }}
                />
            </SelectorBarItem>
        </div>
    )
}
