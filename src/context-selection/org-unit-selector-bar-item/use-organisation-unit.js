import { useQuery } from 'react-query'
import { useOrgUnitId } from '../use-context-selection.js'

const QUERY_ORG_UNIT = {
    orgUnit: {
        resource: 'organisationUnits',
        id: ({ id }) => id,
        params: {
            fields: ['id', 'displayName', 'path'],
        },
    },
}

export default function useOrgUnit() {
    const [orgUnitId] = useOrgUnitId()
    const queryKey = [QUERY_ORG_UNIT, { id: orgUnitId }]
    const {
        isLoading: loading,
        error,
        data,
    } = useQuery(queryKey, { enabled: !!orgUnitId })

    const orgUnit = data?.orgUnit

    return {
        loading,
        error,
        data: orgUnitId ? orgUnit : undefined,
    }
}
