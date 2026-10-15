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
import OrgUnitSearchTree from './org-unit-search-tree.jsx'
import css from './org-unit-selector-bar-item.module.css'
import {
    OrganisationUnitTree,
    OrganisationUnitTreeRootError,
    OrganisationUnitTreeRootLoading,
} from './organisation-unit-tree/index.js'
import useExpandedState from './use-expanded-state.js'
import useOrgUnitsByName, {
    MAX_SEARCH_RESULTS,
} from './use-org-units-by-name.js'
import usePrefetchedOrganisationUnits from './use-prefetched-organisation-units.js'
import useSelectorBarItemValue from './use-select-bar-item-value.js'
import useUserOrgUnits from './use-user-org-units.js'

const UnclickableLabel = ({ label, noDataSets }) => {
    return (
        <div className={css.disabled}>
            <Tooltip
                content={
                    noDataSets
                        ? i18n.t(
                              'No data sets are assigned to this organisation unit'
                          )
                        : i18n.t(
                              'Dataset is not assigned to this organisation unit'
                          )
                }
            >
                <span>{label}</span>
            </Tooltip>
        </div>
    )
}

UnclickableLabel.propTypes = {
    label: PropTypes.any.isRequired,
    noDataSets: PropTypes.bool,
}

export default function OrganisationUnitSetSelectorBarItem() {
    const prefetchedOrganisationUnits = usePrefetchedOrganisationUnits()

    const { show: showWarningAlert } = useAlert((message) => message, {
        warning: true,
    })

    const [filter, setFilter] = useState('')
    const orgUnitsByName = useOrgUnitsByName(filter)

    const [orgUnitOpen, setOrgUnitOpen] = useState(false)
    const { expanded, handleExpand, handleCollapse } = useExpandedState()
    const { data: metadata } = useMetadata()
    const [dataSetId] = useDataSetId()
    const { organisationUnits: assignedOrgUnits } =
        (dataSetId
            ? selectors.getDataSetById(metadata, dataSetId)
            : selectors.getAllAssignedOrgUnits(metadata)) || {}

    const [orgUnitId, setOrgUnitId] = useOrgUnitId()

    const orgUnit = useOrgUnit()
    const userOrgUnits = useUserOrgUnits()

    const selectorBarItemValue = useSelectorBarItemValue()
    const selected = orgUnit.data ? [orgUnit.data.path] : []
    const searchResults = filter ? orgUnitsByName.data?.orgUnits ?? [] : []
    const loading =
        // offline levels need to be prefetched before rendering the org-unit-tree
        prefetchedOrganisationUnits.loading ||
        // Either a filter has been set but the hook
        // hasn't been called yet
        (filter !== '' && !orgUnitsByName.called) ||
        // or it's actually loading
        orgUnitsByName.loading
    const searchError = filter ? orgUnitsByName.error : undefined
    const error = searchError || prefetchedOrganisationUnits.error
    const isSelectable = (id) => !!assignedOrgUnits?.includes(id)
    const renderNodeLabel = ({ node, label }) =>
        isSelectable(node?.id) ? (
            label
        ) : (
            <UnclickableLabel label={label} noDataSets={!dataSetId} />
        )
    const handleTreeChange = ({ id }, e) => {
        // Not sure why this is necessary, but when not done,
        // it causes bugs in the UI
        e.stopPropagation()
        if (isSelectable(id)) {
            setOrgUnitId(id)
            setOrgUnitOpen(false)
        }
    }

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
            <SelectorBarItem
                label={i18n.t('Organisation unit')}
                value={selectorBarItemValue}
                open={orgUnitOpen}
                setOpen={setOrgUnitOpen}
                noValueMessage={i18n.t('Choose a organisation unit')}
                onClearSelectionClick={() => {
                    setOrgUnitId(undefined)
                }}
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
                        {loading && (
                            <OrganisationUnitTreeRootLoading dataTest="org-unit-selector-loading" />
                        )}

                        {!loading && error && (
                            <OrganisationUnitTreeRootError
                                dataTest="org-unit-selector-error"
                                error={error}
                            />
                        )}

                        {!loading &&
                            !searchError &&
                            !!filter &&
                            !searchResults.length && (
                                <div
                                    data-test="org-unit-selector-none-found"
                                    className={css.searchNoneFound}
                                >
                                    {i18n.t(
                                        'No organisation units could be found'
                                    )}
                                </div>
                            )}

                        {!loading && !searchError && !!searchResults.length && (
                            <>
                                <OrgUnitSearchTree
                                    // reset the expanded state per search
                                    key={filter}
                                    orgUnits={searchResults}
                                    offlineLevels={
                                        prefetchedOrganisationUnits.offlineLevels
                                    }
                                    prefetchedOrganisationUnits={
                                        prefetchedOrganisationUnits.offlineOrganisationUnits
                                    }
                                    selected={selected}
                                    onChange={handleTreeChange}
                                    renderNodeLabel={renderNodeLabel}
                                />
                                {orgUnitsByName.data.hasMore && (
                                    <div
                                        className={css.searchResultsMore}
                                        data-test="org-unit-selector-search-results-more"
                                    >
                                        {i18n.t(
                                            'Showing the first {{maxResults}} results. Refine your search to find other organisation units.',
                                            { maxResults: MAX_SEARCH_RESULTS }
                                        )}
                                    </div>
                                )}
                            </>
                        )}

                        {!loading && !filter && (
                            <OrganisationUnitTree
                                dataTest="org-unit-selector-tree"
                                singleSelection
                                roots={userOrgUnits.data || []}
                                selected={selected}
                                expanded={expanded}
                                handleExpand={handleExpand}
                                handleCollapse={handleCollapse}
                                onChange={handleTreeChange}
                                renderNodeLabel={renderNodeLabel}
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
        </div>
    )
}
