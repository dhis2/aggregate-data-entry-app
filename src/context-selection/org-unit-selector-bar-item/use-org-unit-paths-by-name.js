import { useQuery } from 'react-query'

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
    const { isIdle, isFetching, error, data } = useQuery(queryKey, {
        enabled: !!searchTerm,
        select: (data) => data.organisationUnits.map(({ path }) => path),
    })

    return {
        called: !isIdle,
        loading: isFetching,
        error,
        data,
    }
}
