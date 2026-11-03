import i18n from '@dhis2/d2-i18n'
import PropTypes from 'prop-types'
import React, { useMemo, useState } from 'react'
import css from './org-unit-selector-bar-item.module.css'
import { OrganisationUnitTree } from './organisation-unit-tree/index.js'
import { MAX_SEARCH_RESULTS } from './use-org-units-by-name.js'

/**
 * The offline levels are keyed by the paths of the user org units
 */
export const getSearchResultOfflineLevels = (orgUnits, offlineLevels = {}) => {
    const userOrgUnitEntries = Object.entries(offlineLevels)

    return Object.fromEntries(
        orgUnits.map(({ path }) => {
            const [, levels = []] =
                userOrgUnitEntries.find(([userOrgUnitPath]) => {
                    const userOrgUnitId = userOrgUnitPath.split('/').pop()
                    return path.split('/').includes(userOrgUnitId)
                }) ?? []

            return [path, levels]
        })
    )
}

/**
 * Like the Capture app, the org units matching the search term are used as
 * the roots of the tree, so they can be selected directly and expanded to
 * reach their descendants
 * The matching org units are expanded initially
 */
export default function OrgUnitSearchTree({
    orgUnits,
    hasMore,
    offlineLevels,
    prefetchedOrganisationUnits,
    ...treeProps
}) {
    const [expanded, setExpanded] = useState(() =>
        orgUnits.map(({ id }) => `/${id}`)
    )
    const roots = useMemo(() => orgUnits.map(({ id }) => id), [orgUnits])
    const searchResultOfflineLevels = useMemo(
        () => getSearchResultOfflineLevels(orgUnits, offlineLevels),
        [orgUnits, offlineLevels]
    )

    return (
        <>
            <OrganisationUnitTree
                {...treeProps}
                dataTest="org-unit-selector-tree"
                singleSelection
                roots={roots}
                expanded={expanded}
                handleExpand={({ path }) =>
                    setExpanded((prev) => [...new Set([...prev, path])])
                }
                handleCollapse={({ path }) =>
                    setExpanded((prev) => prev.filter((p) => p !== path))
                }
                offlineLevels={searchResultOfflineLevels}
                prefetchedOrganisationUnits={prefetchedOrganisationUnits ?? []}
            />
            {hasMore && (
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
    )
}

OrgUnitSearchTree.propTypes = {
    orgUnits: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string.isRequired,
            path: PropTypes.string.isRequired,
        })
    ).isRequired,
    hasMore: PropTypes.bool,
    offlineLevels: PropTypes.objectOf(PropTypes.arrayOf(PropTypes.number)),
    prefetchedOrganisationUnits: PropTypes.array,
}
