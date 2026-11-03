import { useQueries } from '@tanstack/react-query'
import useOrgUnitSearchField from './use-org-unit-search-field.js'
import useUserOrgUnits from './use-user-org-units.js'

export const MAX_SEARCH_RESULTS = 15

const sortByDisplayName = (a, b) => a.displayName.localeCompare(b.displayName)

/**
 * Searches the org units within the user's hierarchy by name
 * The results are merged, de-duplicated and capped at `MAX_SEARCH_RESULTS`
 */
export default function useOrgUnitsByName(searchTerm) {
    const userOrgUnits = useUserOrgUnits()
    const { searchField, loading: searchFieldLoading } = useOrgUnitSearchField()
    const rootIds = userOrgUnits.data || []

    const queries = useQueries({
        queries: rootIds.map((rootId) => ({
            queryKey: [
                'organisationUnits',
                {
                    params: {
                        fields: ['id', 'displayName', 'path'],
                        filter: [
                            `${searchField}:ilike:${searchTerm}`,
                            `path:like:${rootId}`,
                        ],
                        order: 'name:asc',
                        pageSize: MAX_SEARCH_RESULTS,
                    },
                },
            ],
            enabled: !!searchTerm && !searchFieldLoading,
        })),
    })

    const called =
        !userOrgUnits.loading &&
        !searchFieldLoading &&
        queries.every(({ isFetched }) => isFetched)
    const loading =
        userOrgUnits.loading ||
        searchFieldLoading ||
        queries.some(({ data, isFetching }) => !data && isFetching)
    const error =
        userOrgUnits.error || queries.find(({ error }) => error)?.error

    if (!called || loading || error) {
        return { called, loading, error, data: undefined }
    }

    const orgUnitsById = new Map()
    queries.forEach(({ data }) => {
        data.organisationUnits.forEach((orgUnit) => {
            orgUnitsById.set(orgUnit.id, orgUnit)
        })
    })
    const orgUnits = [...orgUnitsById.values()].sort(sortByDisplayName)
    const hasMore =
        orgUnits.length > MAX_SEARCH_RESULTS ||
        queries.some(
            ({ data }) => data.pager && data.pager.total > MAX_SEARCH_RESULTS
        )

    return {
        called,
        loading,
        error,
        data: {
            orgUnits: orgUnits.slice(0, MAX_SEARCH_RESULTS),
            hasMore,
        },
    }
}
