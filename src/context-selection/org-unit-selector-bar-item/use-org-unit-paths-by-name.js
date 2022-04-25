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
    const {
        isIdle,
        isLoading: loading,
        error,
        data,
    } = useQuery(queryKey, {
        enabled: !!searchTerm,
        select: (data) => data.organisationUnits.map(({ path }) => path),
    })

    return {
        called: !isIdle,
        loading,
        error,
        data,
    }
}
