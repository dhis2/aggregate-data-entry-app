import { useQuery } from 'react-query'

const QUERY_USER_ORG_UNITS = {
    orgUnits: {
        resource: 'me',
        params: {
            fields: ['organisationUnits[id]'],
        },
    },
}

export default function useUserOrgUnits() {
    const { isLoading: loading, error, data } = useQuery([QUERY_USER_ORG_UNITS])
    const userOrgUnits = data?.orgUnits?.organisationUnits?.map(({ id }) => id)

    return {
        data: userOrgUnits,
        loading,
        error,
    }
}
