import i18n from '@dhis2/d2-i18n'
import { CircularLoader, OrganisationUnitTree, SelectorBarItem } from '@dhis2/ui'
import React, { useState } from 'react'
import {
    useAttributeOptionComboSelection,
    useDataSetId,
    useOrgUnitId,
} from '../use-context-selection/index.js'
import DebouncedSearchInput from './debounced-search-input.js'
import DisabledTooltip from './disabled-tooltip.js'
import getFilteredOrgUnitPaths from './get-filtered-org-unit-paths.js'
import css from './org-unit-selector-bar-item.module.css'
import useDataSetOrgUnitPaths from './use-data-set-org-unit-paths.js'
import useExpandedState from './use-expanded-state.js'
import useOrgUnitPathsByName from './use-org-unit-paths-by-name.js'
import useOrgUnit from './use-organisation-unit.js'
import useSelectorBarItemValue from './use-select-bar-item-value.js'
import useUserOrgUnits from './use-user-org-units.js'

// @TODO: Expose this component in the UI library
const RootLoading = () => (
    <div data-test={`-loading`}>
        <CircularLoader small />

        <style jsx>{`
            div {
                display: flex;
                justify-content: center;
            }
        `}</style>
    </div>
)

// @TODO: Expose this component in the UI library
const RootError = ({ error }) => ( // eslint-disable-line
    <div data-test={`-error`}>
        {i18n.t('Error: {{ ERRORMESSAGE }}', {
            ERRORMESSAGE: error,
            nsSeparator: '>',
        })}
    </div>
)

export default function OrganisationUnitSetSelectorBarItem() {
    const [filter, setFilter] = useState('')
    const orgUnitPathsByName = useOrgUnitPathsByName(filter)

    const [orgUnitOpen, setOrgUnitOpen] = useState(false)
    const { expanded, handleExpand, handleCollapse } = useExpandedState()
    const [dataSetId] = useDataSetId()
    const [, setOrgUnitId] = useOrgUnitId()
    const [, setAttributeOptionComboSelection] =
        useAttributeOptionComboSelection()

    const orgUnit = useOrgUnit()
    const userOrgUnits = useUserOrgUnits()

    // @TODO: Figure out how to only use org units that are connected to the
    // data set. Currently the api only returns paths for the units on the
    // lowest level, Task: Figure out if only the lowest levels should be
    // selectable, if the levels above are missing from the response or whether
    // all parent units are automatically selectable as well
    const dataSetOrgUnitPaths = useDataSetOrgUnitPaths()

    const selectorBarItemValue = useSelectorBarItemValue()
    const selected = orgUnit.data ? [orgUnit.data.path] : []
    const disabled = !dataSetId
    const filteredOrgUnitPaths = getFilteredOrgUnitPaths({
        filter,
        orgUnitPathsByName: orgUnitPathsByName.data,
        dataSetOrgUnitPaths: dataSetOrgUnitPaths.data,
    })
    const orgUnitPathsByNameLoading = (
        // Either a filter has been set but the hook
        // hasn't been called yet
        (filter !== '' && !orgUnitPathsByName.called) ||
        // or it's actually loading
        orgUnitPathsByName.loading
    )

    return (
        <DisabledTooltip>
            <SelectorBarItem
                disabled={disabled}
                label={i18n.t('Organisation unit')}
                value={selectorBarItemValue}
                open={orgUnitOpen}
                setOpen={setOrgUnitOpen}
                noValueMessage={i18n.t('Choose a organisation unit')}
            >
                <div className={css.itemContentContainer}>
                    <div className={css.searchInputContainer}>
                        <DebouncedSearchInput onChange={setFilter} />
                    </div>

                    <div className={css.orgUnitTreeContainer}>
                        {orgUnitPathsByNameLoading && <RootLoading />}

                        {!orgUnitPathsByNameLoading &&
                            orgUnitPathsByName.error &&
                            <RootError error={orgUnitPathsByName.error} />
                        }

                        {!orgUnitPathsByNameLoading &&
                            !!filter &&
                            !filteredOrgUnitPaths.length &&
                            i18n.t('No organisation units could be found')}

                        {!orgUnitPathsByNameLoading &&
                            (!filter || !!filteredOrgUnitPaths.length) &&
                            <OrganisationUnitTree
                                singleSelection
                                filter={filteredOrgUnitPaths}
                                roots={userOrgUnits.data || []}
                                selected={selected}
                                expanded={expanded}
                                handleExpand={handleExpand}
                                handleCollapse={handleCollapse}
                                onChange={({ id }, e) => {
                                    // Not sure why this is necessary, but when not done,
                                    // it causes bugs in the UI
                                    e.stopPropagation()

                                    setOrgUnitId(id)
                                    setOrgUnitOpen(false)
                                    setAttributeOptionComboSelection([])
                                }}
                            />
                        }
                    </div>
                </div>
            </SelectorBarItem>
        </DisabledTooltip>
    )
}
