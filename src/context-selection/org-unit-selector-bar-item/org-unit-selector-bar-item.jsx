import { useAlert } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import { SelectorBarItem, Divider, Tooltip } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { useEffect, useState } from 'react'
import {
    selectors,
    useMetadata,
    useDataSetId,
    useOrgUnitId,
    useOrgUnit,
} from '../../shared/index.js'
import DebouncedSearchInput from './debounced-search-input.jsx'
import DisabledTooltip from './disabled-tooltip.jsx'
import css from './org-unit-selector-bar-item.module.css'
import {
    OrganisationUnitTree,
    OrganisationUnitTreeRootError,
    OrganisationUnitTreeRootLoading,
} from './organisation-unit-tree/index.js'
import useExpandedState from './use-expanded-state.js'
import useOrgUnitPathsByName from './use-org-unit-paths-by-name.js'
import usePrefetchedOrganisationUnits from './use-prefetched-organisation-units.js'
import useSelectorBarItemValue from './use-select-bar-item-value.js'
import useUserOrgUnits from './use-user-org-units.js'

const UnclickableLabel = ({ label }) => {
    return (
        <div className={css.disabled}>
            <Tooltip
                content={i18n.t(
                    'Dataset is not assigned to this organisation unit'
                )}
            >
                <span>{label}</span>
            </Tooltip>
        </div>
    )
}

UnclickableLabel.propTypes = {
    label: PropTypes.any.isRequired,
}

export default function OrganisationUnitSetSelectorBarItem() {
    const prefetchedOrganisationUnits = usePrefetchedOrganisationUnits()

    const { show: showWarningAlert } = useAlert((message) => message, {
        warning: true,
    })

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
        // offline levels need to be prefetched before rendering the org-unit-tree
        prefetchedOrganisationUnits.loading ||
        // Either a filter has been set but the hook
        // hasn't been called yet
        (filter !== '' && !orgUnitPathsByName.called) ||
        // or it's actually loading
        orgUnitPathsByName.loading

    useEffect(() => {
        // set as undefined if orgUnit is not assigned to dataset
        if (orgUnitId && assignedOrgUnits) {
            if (!assignedOrgUnits.includes(orgUnitId)) {
                showWarningAlert(
                    i18n.t(
                        'There was a problem loading the {{objectType}} selection ({{id}}). You might not have access, or the selection might be invalid.',
                        {
                            objectType: 'Organisation Unit',
                            id: orgUnitId,
                        }
                    )
                )
                setOrgUnitId(undefined)
            }
        }
    }, [orgUnitId, assignedOrgUnits, setOrgUnitId, showWarningAlert])

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
                        <div className={css.dividerContainer}>
                            <Divider dense />
                        </div>
                        <div className={css.orgUnitTreeContainer}>
                            {orgUnitPathsByNameLoading && (
                                <OrganisationUnitTreeRootLoading dataTest="org-unit-selector-loading" />
                            )}

                            {!orgUnitPathsByNameLoading &&
                                (orgUnitPathsByName.error ||
                                    prefetchedOrganisationUnits.error) && (
                                    <OrganisationUnitTreeRootError
                                        dataTest="org-unit-selector-error"
                                        error={
                                            orgUnitPathsByName.error ||
                                            prefetchedOrganisationUnits.error
                                        }
                                    />
                                )}

                            {!orgUnitPathsByNameLoading &&
                                !!filter &&
                                !filteredOrgUnitPaths.length && (
                                    <div data-test="org-unit-selector-none-found">
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
                                        offlineLevels={
                                            prefetchedOrganisationUnits.offlineLevels
                                        }
                                        prefetchedOrganisationUnits={
                                            prefetchedOrganisationUnits.offlineOrganisationUnits
                                        }
                                    />
                                )}
                        </div>
                    </div>
                </SelectorBarItem>
            </DisabledTooltip>
        </div>
    )
}
