import { useAlert } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import {
    SelectorBarItem,
    Divider,
    Tooltip,
    Button,
    ButtonStrip,
} from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { useEffect, useRef, useState } from 'react'
import { tabbable } from 'tabbable'
import {
    selectors,
    useMetadata,
    useDataSetId,
    useOrgUnitId,
    useOrgUnit,
} from '../../shared/index.js'
import DebouncedSearchInput from './debounced-search-input.jsx'
import css from './org-unit-selector-bar-item.module.css'
import {
    OrganisationUnitTree,
    OrganisationUnitTreeRootError,
    OrganisationUnitTreeRootLoading,
} from './organisation-unit-tree/index.js'
import useExpandedState from './use-expanded-state.js'
import useOrgUnitPathsByName, {
    isSearchTermValid,
} from './use-org-unit-paths-by-name.js'
import usePrefetchedOrganisationUnits from './use-prefetched-organisation-units.js'
import useSelectorBarItemValue from './use-select-bar-item-value.js'
import useUserOrgUnits from './use-user-org-units.js'

const handleSearchKeyDown = (event) => {
    if (event.key !== 'Tab') {
        return
    }
    const controls = tabbable(event.currentTarget)
    const index = controls.indexOf(document.activeElement)
    if (index >= 0 && controls[index + (event.shiftKey ? -1 : 1)]) {
        // Let focus move within the popup before SelectorBarItem dismisses it.
        event.stopPropagation()
    }
}

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
    const [inputValue, setInputValue] = useState('')
    const [page, setPage] = useState(1)
    const searchContentRef = useRef()
    const changePage = (direction) => {
        setPage((value) => value + direction)
        // The activated button may become disabled on the first/last page.
        searchContentRef.current?.querySelector('input')?.focus()
    }
    const searching = isSearchTermValid(inputValue)
    const debouncing = searching && inputValue.trim() !== filter
    const searchTerm = searching && !debouncing ? filter : ''
    const orgUnitPathsByName = useOrgUnitPathsByName(searchTerm, page)

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
    const filteredOrgUnitPaths = searching ? orgUnitPathsByName.data || [] : []
    const orgUnitPathsByNameLoading =
        // Offline tree prefetch is independent of interactive search.
        prefetchedOrganisationUnits.loading ||
        debouncing ||
        orgUnitPathsByName.loading
    const searchUnavailable =
        searching && orgUnitPathsByName.paused && !orgUnitPathsByName.data

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
                <div
                    ref={searchContentRef}
                    className={css.itemContentContainer}
                    role="group"
                    aria-label={i18n.t('Organisation unit search')}
                    onKeyDown={handleSearchKeyDown}
                >
                    <div className={css.searchInputContainer}>
                        <DebouncedSearchInput
                            initialValue={inputValue}
                            onChange={setFilter}
                            onInputChange={(value) => {
                                setInputValue(value)
                                setFilter('')
                                setPage(1)
                            }}
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
                            searching &&
                            !orgUnitPathsByName.error &&
                            !searchUnavailable &&
                            !filteredOrgUnitPaths.length && (
                                <div data-test="org-unit-selector-none-found">
                                    {page === 1
                                        ? i18n.t(
                                              'No organisation units could be found'
                                          )
                                        : i18n.t(
                                              'No more matching organisation units. Go to the previous page or refine your search.'
                                          )}
                                </div>
                            )}

                        {searchUnavailable && (
                            <div role="status">
                                {i18n.t(
                                    'Search results are not available offline. Clear the search to browse available organisation units.'
                                )}
                            </div>
                        )}

                        {!orgUnitPathsByNameLoading &&
                            !orgUnitPathsByName.error &&
                            !searchUnavailable &&
                            (!searching || !!filteredOrgUnitPaths.length) && (
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
                                        if (assignedOrgUnits?.includes(id)) {
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
                                            <UnclickableLabel label={label} />
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
                    {searching &&
                        !debouncing &&
                        (page > 1 || filteredOrgUnitPaths.length > 0) && (
                            <div className={css.searchPagingContainer}>
                                <p role="status">
                                    {i18n.t(
                                        'Page {{page}}. Up to 50 matches; some may not be selectable.',
                                        { page }
                                    )}
                                </p>
                                <ButtonStrip>
                                    <Button
                                        small
                                        disabled={page === 1}
                                        onClick={() => changePage(-1)}
                                    >
                                        {i18n.t('Previous page')}
                                    </Button>
                                    <Button
                                        small
                                        disabled={
                                            orgUnitPathsByNameLoading ||
                                            !orgUnitPathsByName.hasNextPage
                                        }
                                        onClick={() => changePage(1)}
                                    >
                                        {i18n.t('Next page')}
                                    </Button>
                                </ButtonStrip>
                            </div>
                        )}
                </div>
            </SelectorBarItem>
        </div>
    )
}
