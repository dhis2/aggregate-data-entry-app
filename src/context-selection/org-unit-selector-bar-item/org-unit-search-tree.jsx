import PropTypes from 'prop-types'
import React, { useMemo, useState } from 'react'
import { OrganisationUnitTree } from './organisation-unit-tree/index.js'

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
    )
}

OrgUnitSearchTree.propTypes = {
    orgUnits: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string.isRequired,
            path: PropTypes.string.isRequired,
        })
    ).isRequired,
    offlineLevels: PropTypes.objectOf(PropTypes.arrayOf(PropTypes.number)),
    prefetchedOrganisationUnits: PropTypes.array,
}
