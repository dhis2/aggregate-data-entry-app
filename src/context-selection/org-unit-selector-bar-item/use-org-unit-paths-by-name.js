import { useQuery } from 'react-query'

const QUERY_SEARCH_ORG_UNITS = {
    orgUnits: {
        resource: 'organisationUnits',
        params: ({ searchTerm }) => ({
            fields: ['path'],
            filter: `displayName:ilike:${searchTerm}`,
            paging: false,
        }),
    },
}

export default function useOrgUnitPathsByName(searchTerm) {
    const queryKey = [QUERY_SEARCH_ORG_UNITS, { searchTerm }]
    const {
        isIdle,
        isLoading: loading,
        error,
        data,
    } = useQuery(queryKey, { enabled: !!searchTerm })

    const paths = !data?.orgUnits?.organisationUnits
        ? []
        : data.orgUnits.organisationUnits.map(({ path }) => path)

    return {
        called: !isIdle,
        loading,
        error,
        data: paths,
    }
}
