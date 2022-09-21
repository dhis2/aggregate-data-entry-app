import { useDataQuery } from '@dhis2/app-runtime'
import { useMemo, useEffect, useRef } from 'react'
import {
    getPreFetchedChildren,
    sortNodeChildrenAlphabetically,
} from '../helpers/index.js'

const ORG_DATA_QUERY = {
    orgUnit: {
        resource: `organisationUnits`,
        id: ({ id }) => id,
        params: {
            fields: 'children[id,path,displayName,children::size,level]',
        },
    },
}

/**
 * @param {string[]} ids
 * @param {Object} options
 * @param {string} options.displayName
 * @param {boolean} [options.withChildren]
 * @returns {Object}
 */
export const useOrgChildren = ({
    node,
    suppressAlphabeticalSorting,
    onComplete,
    offlineLevels,
    prefetchedOrganisationUnits,
}) => {
    const onCompleteCalledRef = useRef(false)
    const { called, loading, error, data, refetch } = useDataQuery(
        ORG_DATA_QUERY,
        {
            variables: { id: node.id },
            lazy: true,
        }
    )

    const prefetchedChildren = useMemo(
        () =>
            offlineLevels.includes(node.level + 1)
                ? getPreFetchedChildren(prefetchedOrganisationUnits, node)
                : null,
        [node, offlineLevels, prefetchedOrganisationUnits]
    )

    const nodes = useMemo(() => {
        if (!data && !prefetchedChildren) {
            return undefined
        }

        const childNodes = prefetchedChildren ?? data.orgUnit.children

        return suppressAlphabeticalSorting
            ? childNodes
            : sortNodeChildrenAlphabetically(childNodes)
    }, [data, prefetchedChildren, suppressAlphabeticalSorting])

    useEffect(() => {
        if (onComplete && nodes && !onCompleteCalledRef.current) {
            // For backwards compatibility: Pass entire node incl. children
            onComplete({ ...node, children: nodes })
            onCompleteCalledRef.current = true
        }
    }, [node, onComplete, nodes, onCompleteCalledRef])

    return {
        show:
            node.childCount === 0 ||
            !!prefetchedChildren ||
            (called && !loading && !error),
        loading: (node.childCount > 0 && loading) || false,
        error: error || null,
        nodes,
        fetch: refetch,
    }
}
