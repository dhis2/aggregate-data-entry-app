import { useDataQuery } from '@dhis2/app-runtime'

const QUERY_USER_ORG_UNITS = {
    orgUnits: {
        resource: 'me',
        params: {
            fields: ['organisationUnits[id]'],
        },
    },
}

export default function useUserOrgUnits() {
    const { loading, error, data } = useDataQuery(QUERY_USER_ORG_UNITS)
    const userOrgUnits = data?.orgUnits.organisationUnits.map(({ id }) => id)

    return {
        data: userOrgUnits,
        loading,
        error,
    }
}
