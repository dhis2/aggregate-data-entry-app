import { useQuery } from 'react-query'

export default function useOrgUnitPathsByName(searchTerm) {
    const queryKey = [
        {
            orgUnits: {
                resource: 'organisationUnits',
                params: {
                    fields: ['path'],
                    filter: `displayName:ilike:${searchTerm}`,
                    paging: false,
                },
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
        initialData: [],
        select: (data) =>
            data.orgUnits.organisationUnits.map(({ path }) => path),
    })

    return {
        called: !isIdle,
        loading,
        error,
        data,
    }
}
