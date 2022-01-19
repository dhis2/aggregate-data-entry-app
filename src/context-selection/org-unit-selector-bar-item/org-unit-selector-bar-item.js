import i18n from '@dhis2/d2-i18n'
import {
    OrganisationUnitTree,
    OrganisationUnitTreeRootError,
    OrganisationUnitTreeRootLoading,
    SelectorBarItem,
} from '@dhis2/ui'
import React, { useState } from 'react'
import { useDataSetId, useOrgUnitId } from '../use-context-selection/index.js'
import DebouncedSearchInput from './debounced-search-input.js'
import DisabledTooltip from './disabled-tooltip.js'
import css from './org-unit-selector-bar-item.module.css'
import useExpandedState from './use-expanded-state.js'
import useOrgUnitPathsByName from './use-org-unit-paths-by-name.js'
import useOrgUnit from './use-organisation-unit.js'
import useSelectorBarItemValue from './use-select-bar-item-value.js'
import useUserOrgUnits from './use-user-org-units.js'

export default function OrganisationUnitSetSelectorBarItem() {
    const [filter, setFilter] = useState('')
    const orgUnitPathsByName = useOrgUnitPathsByName(filter)

    const [orgUnitOpen, setOrgUnitOpen] = useState(false)
    const { expanded, handleExpand, handleCollapse } = useExpandedState()
    const [dataSetId] = useDataSetId()
    const [, setOrgUnitId] = useOrgUnitId()

    const orgUnit = useOrgUnit()
    const userOrgUnits = useUserOrgUnits()

    // @TODO: Figure out how to only use org units that are connected to the
    // data set. Currently the api only returns paths for the units on the
    // lowest level, Task: Figure out if only the lowest levels should be
    // selectable, if the levels above are missing from the response or whether
    // all parent units are automatically selectable as well
    // const dataSetOrgUnitPaths = useDataSetOrgUnitPaths()

    const selectorBarItemValue = useSelectorBarItemValue()
    const selected = orgUnit.data ? [orgUnit.data.path] : []
    const disabled = !dataSetId
    const filteredOrgUnitPaths = filter ? [] : orgUnitPathsByName.data
    const orgUnitPathsByNameLoading =
        // Either a filter has been set but the hook
        // hasn't been called yet
        (filter !== '' && !orgUnitPathsByName.called) ||
        // or it's actually loading
        orgUnitPathsByName.loading

    return (
        <div data-test="org-unit-selector">
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
                            <DebouncedSearchInput
                                initialValue={filter}
                                onChange={setFilter}
                            />
                        </div>

                        <div className={css.orgUnitTreeContainer}>
                            {orgUnitPathsByNameLoading && (
                                <OrganisationUnitTreeRootLoading dataTest="org-unit-selector-loading" />
                            )}

                            {!orgUnitPathsByNameLoading &&
                                orgUnitPathsByName.error && (
                                    <OrganisationUnitTreeRootError
                                        dataTest="org-unit-selector-error"
                                        error={orgUnitPathsByName.error}
                                    />
                                )}

                            {!orgUnitPathsByNameLoading &&
                                !!filter &&
                                !filteredOrgUnitPaths.length && (
                                    <div dataTest="org-unit-selector-none-found">
                                        {i18n.t(
                                            'No organisation units could be found'
                                        )}
                                    </div>
                                )}

                            {!orgUnitPathsByNameLoading &&
                                (!filter || !!filteredOrgUnitPaths.length) && (
                                    <OrganisationUnitTree
                                        dataTest="org-unit-selector-tree"
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
                                        }}
                                    />
                                )}
                        </div>
                    </div>
                </SelectorBarItem>
            </DisabledTooltip>
        </div>
    )
}
