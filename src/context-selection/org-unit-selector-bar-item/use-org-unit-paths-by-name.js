import { useQuery } from '@tanstack/react-query'

export default function useOrgUnitPathsByName(searchTerm) {
    const queryKey = [
        'organisationUnits',
        {
            params: {
                fields: ['path'],
                filter: `displayName:ilike:${searchTerm}`,
                paging: false,
            },
        },
    ]
    const { isFetched, isFetching, error, data } = useQuery(queryKey, {
        enabled: !!searchTerm,
        select: (data) => data.organisationUnits.map(({ path }) => path),
    })
    return {
        called: isFetched,
        loading: !data && isFetching,
        error,
        data,
    }
}
