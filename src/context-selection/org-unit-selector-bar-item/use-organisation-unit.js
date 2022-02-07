import { useQuery, onlineManager } from 'react-query'
import { useOrgUnitId } from '../use-context-selection/index.js'

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
    const isOnline = onlineManager.isOnline()
    const [orgUnitId] = useOrgUnitId()
    const queryKey = [QUERY_ORG_UNIT, { id: orgUnitId }]
    const {
        isLoading: loading,
        error,
        data,
    } = useQuery(queryKey, { enabled: !!orgUnitId && isOnline })

    const orgUnit = data?.orgUnit

    return {
        loading,
        error,
        data: orgUnitId ? orgUnit : undefined,
    }
}
