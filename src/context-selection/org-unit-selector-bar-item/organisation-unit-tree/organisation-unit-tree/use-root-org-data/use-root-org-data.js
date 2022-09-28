import { useDataQuery } from '@dhis2/app-runtime'
import { useMemo, useEffect, useCallback } from 'react'
import { patchMissingDisplayName } from './patch-missing-display-name.js'

export const rootsQuery = {
    roots: {
        resource: `organisationUnits`,
        params: ({ isUserDataViewFallback, ids }) => ({
            isUserDataViewFallback,
            filter: `id:in:[${ids.join()}]`,
            paging: false,
            fields: ['displayName', 'path', 'id', 'children::size', 'level'],
        }),
    },
}

/**
 * @param {string[]} ids
 * @param {Object} [options]
 * @param {boolean} [options.withChildren]
 * @param {boolean} [options.isUserDataViewFallback]
 * @returns {Object}
 */
export const useRootOrgData = (
    ids,
    { isUserDataViewFallback, prefetchedOrganisationUnits } = {}
) => {
    const { called, loading, error, data, refetch } = useDataQuery(rootsQuery, {
        variables: { isUserDataViewFallback, ids },
        lazy: true,
    })

    const prefetchedRoots = useMemo(() => {
        const prefetchedRoots = prefetchedOrganisationUnits?.filter(({ id }) =>
            ids.includes(id)
        )
        return prefetchedRoots && prefetchedRoots.length === ids.length
            ? patchMissingDisplayName(prefetchedRoots)
            : undefined
    }, [ids, prefetchedOrganisationUnits])

    const fetchedRoots = useMemo(
        () =>
            data
                ? patchMissingDisplayName(data.roots.organisationUnits)
                : undefined,
        [data]
    )

    const fetchIfNotPrefetched = useCallback(() => {
        if (!prefetchedRoots) {
            refetch()
        }
    }, [prefetchedRoots, refetch])

    useEffect(() => {
        fetchIfNotPrefetched()
    }, [fetchIfNotPrefetched])

    return {
        called: prefetchedRoots ? true : called,
        loading: prefetchedRoots ? false : loading,
        error: prefetchedRoots ? null : error || null,
        rootNodes: prefetchedRoots ?? fetchedRoots,
        refetch,
    }
}
