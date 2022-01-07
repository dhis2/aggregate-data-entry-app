import i18n from '@dhis2/d2-i18n'
import { InputField, OrganisationUnitTree, SelectorBarItem } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { useState } from 'react'
import {
    useCategoryOptionComboSelection,
    useDataSetId,
    useOrgUnitId,
} from '../use-context-selection.js'
import DisabledTooltip from './disabled-tooltip.js'
import css from './org-unit-selector-bar-item.module.css'
import SearchInput from './search-input.js'
// import useDataSetOrgUnitPaths from './use-data-set-org-unit-paths.js'
import useExpandedState from './use-expanded-state.js'
import useOrgUnit from './use-organisation-unit.js'
import useSelectorBarItemValue from './use-select-bar-item-value.js'
import useUserOrgUnits from './use-user-org-units.js'

export default function OrganisationUnitSetSelectorBarItem() {
    const [availableOrgUnits, setAvailableOrgUnits] = useState({})

    // undefined = no search
    // empty array = none found
    // non-empty array = some found
    const [filter, setFilter] = useState(undefined)

    const [orgUnitOpen, setOrgUnitOpen] = useState(false)
    const { expanded, handleExpand, handleCollapse } = useExpandedState()
    const [dataSetId] = useDataSetId()
    const [, setOrgUnitId] = useOrgUnitId()
    const [, setCategoryOptionComboSelection] =
        useCategoryOptionComboSelection()

    const orgUnit = useOrgUnit()
    const userOrgUnits = useUserOrgUnits()

    // @TODO: Figure out how to handle org units that only the user is allowed
    // to see, including which org units should be the roots
    // const dataSetOrgUnitPaths = useDataSetOrgUnitPaths()

    const selectorBarItemValue = useSelectorBarItemValue()
    const selected = orgUnit.data ? [orgUnit.data.path] : []
    const disabled = !dataSetId

    return (
        <DisabledTooltip tooltipContent={
            disabled
                ? i18n.t('You must choose a data set first')
                : undefined
        }>
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
                        <SearchInput
                            onChange={search => {
                                if (!search) {
                                    if (filter) {
                                        setFilter(undefined)
                                    }
                                } else {
                                    const loadedUnitEntries = Object.entries(availableOrgUnits)
                                    const foundEntries = loadedUnitEntries.filter(([, displayName]) => displayName.includes(search))
                                    const foundPaths = foundEntries.map(([path]) => path)
                                    setFilter(foundPaths)
                                }
                            }}
                        />
                    </div>

                    <div className={css.orgUnitTreeContainer}>
                        {!!filter && !filter.length && i18n.t('No organisation units could be found')}
                        {(!filter || !!filter.length) && (
                            <OrganisationUnitTree
                                singleSelection
                                filter={filter}
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
                                    setCategoryOptionComboSelection([])
                                }}
                                // filter={dataSetOrgUnitPaths.data || undefined}
                                onChildrenLoaded={({ displayName, path, id }) => {
                                    // @TODO: Fix this in the UI component
                                    // This happens because the root org unit's data
                                    // doesn't get loaded until it's being opened and the
                                    // data being loaded for root org units initially does
                                    // not include the path
                                    path = !path ? `/${id}` : path

                                    if (!availableOrgUnits[path]) {
                                        setAvailableOrgUnits({
                                            ...availableOrgUnits,
                                            [path]: displayName,
                                        })
                                    }
                                }}
                            />
                        )}
                    </div>
                </div>
            </SelectorBarItem>
        </DisabledTooltip>
    )
}
