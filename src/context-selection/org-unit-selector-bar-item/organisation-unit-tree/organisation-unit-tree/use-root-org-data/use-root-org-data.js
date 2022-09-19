import { useDataQuery } from '@dhis2/app-runtime'
import { useMemo, useEffect, useCallback } from 'react'
import { patchMissingDisplayName } from './patch-missing-display-name.js'

export const createRootQuery = (ids) =>
    ids.reduce(
        (query, id) => ({
            ...query,
            [id]: {
                id,
                resource: `organisationUnits`,
                params: ({ isUserDataViewFallback }) => ({
                    isUserDataViewFallback,
                    fields: ['displayName', 'path', 'id'],
                }),
            },
        }),
        {}
    )

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
    const query = createRootQuery(ids)
    const prefetchedRoots = useMemo(() => {
        const prefetchedRoots = prefetchedOrganisationUnits?.reduce(
            (roots, unit) => {
                if (ids.includes(unit.id)) {
                    roots[unit.id] = unit
                }
                return roots
            },
            {}
        )
        return prefetchedRoots &&
            Object.values(prefetchedRoots).length === ids.length
            ? patchMissingDisplayName(prefetchedRoots)
            : undefined
    }, [ids, prefetchedOrganisationUnits])
    const variables = { isUserDataViewFallback }
    const rootOrgUnits = useDataQuery(query, {
        variables,
        lazy: true,
    })
    const { called, loading, error, data, refetch } = rootOrgUnits
    const fetchedRoots = useMemo(
        () => (data ? patchMissingDisplayName(data) : undefined),
        [data]
    )
    const refetchIfNotPrefetched = useCallback(() => {
        if (!prefetchedRoots) {
            refetch()
        }
    }, [prefetchedRoots, refetch])

    useEffect(() => {
        refetchIfNotPrefetched()
    }, [refetchIfNotPrefetched])

    return {
        called: prefetchedRoots ? true : called,
        loading: prefetchedRoots ? false : loading,
        error: prefetchedRoots ? null : error || null,
        data: prefetchedRoots ?? fetchedRoots,
        refetch,
    }
}
