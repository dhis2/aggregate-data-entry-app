import i18n from '@dhis2/d2-i18n'
import {
    OrganisationUnitTree,
    OrganisationUnitTreeRootError,
    OrganisationUnitTreeRootLoading,
    SelectorBarItem,
    IconBlock16,
    Divider,
} from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { useEffect, useState } from 'react'
import {
    selectors,
    useMetadata,
    useDataSetId,
    useOrgUnitId,
} from '../../shared/index.js'
import DebouncedSearchInput from './debounced-search-input.js'
import DisabledTooltip from './disabled-tooltip.js'
import css from './org-unit-selector-bar-item.module.css'
import useExpandedState from './use-expanded-state.js'
import useLoadOfflineLevels from './use-load-offline-levels.js'
import useOrgUnitPathsByName from './use-org-unit-paths-by-name.js'
import useOrgUnit from './use-organisation-unit.js'
import useSelectorBarItemValue from './use-select-bar-item-value.js'
import useUserOrgUnits from './use-user-org-units.js'

const UnclickableLabel = ({ label }) => {
    return (
        <div className={css.disabled}>
            <IconBlock16 />
            <span>{label}</span>
        </div>
    )
}

UnclickableLabel.propTypes = {
    label: PropTypes.any.isRequired,
}

export default function OrganisationUnitSetSelectorBarItem() {
    useLoadOfflineLevels()

    const [filter, setFilter] = useState('')
    const orgUnitPathsByName = useOrgUnitPathsByName(filter)

    const [orgUnitOpen, setOrgUnitOpen] = useState(false)
    const { expanded, handleExpand, handleCollapse } = useExpandedState()
    const { data: metadata } = useMetadata()
    const [dataSetId] = useDataSetId()
    const { organisationUnits: assignedOrgUnits } =
        selectors.getDataSetById(metadata, dataSetId) || {}

    const [orgUnitId, setOrgUnitId] = useOrgUnitId()

    const orgUnit = useOrgUnit()
    const userOrgUnits = useUserOrgUnits()

    const selectorBarItemValue = useSelectorBarItemValue()
    const selected = orgUnit.data ? [orgUnit.data.path] : []
    const disabled = !dataSetId
    const filteredOrgUnitPaths = filter ? orgUnitPathsByName.data : []
    const orgUnitPathsByNameLoading =
        // Either a filter has been set but the hook
        // hasn't been called yet
        (filter !== '' && !orgUnitPathsByName.called) ||
        // or it's actually loading
        orgUnitPathsByName.loading

    useEffect(() => {
        // set as undefined if orgUnit is undefined
        if (!orgUnit && orgUnitId) {
            setOrgUnitId(undefined)
        }
        if (orgUnitId && assignedOrgUnits) {
            if (!assignedOrgUnits.includes(orgUnitId)) {
                setOrgUnitId(undefined)
            }
        }
        // set as undefined if orgUnit is not assigned to dataset
    }, [assignedOrgUnits, orgUnitId, orgUnit, setOrgUnitId])

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
                                            if (
                                                assignedOrgUnits?.includes(id)
                                            ) {
                                                setOrgUnitId(id)
                                                setOrgUnitOpen(false)
                                            }
                                        }}
                                        renderNodeLabel={({ node, label }) => {
                                            return assignedOrgUnits?.includes(
                                                node?.id
                                            ) ? (
                                                label
                                            ) : (
                                                <UnclickableLabel
                                                    label={label}
                                                />
                                            )
                                        }}
                                    />
                                )}
                        </div>
                        <Divider margin="0" />
                        <div className={css.labelContentContainer}>
                            <IconBlock16 />
                            <span className={css.label}>
                                {i18n.t(
                                    'Dataset is not assigned to this organisation unit'
                                )}
                            </span>
                        </div>
                    </div>
                </SelectorBarItem>
            </DisabledTooltip>
        </div>
    )
}
