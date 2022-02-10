import { useQuery } from 'react-query'
import { useOrgUnitId } from '../use-context-selection/index.js'

export default function useOrgUnit() {
    const [orgUnitId] = useOrgUnitId()
    const queryKey = [
        {
            orgUnit: {
                resource: 'organisationUnits',
                id: orgUnitId,
                params: {
                    fields: ['id', 'displayName', 'path'],
                },
            },
        },
    ]
    const {
        isLoading: loading,
        error,
        data,
    } = useQuery(queryKey, {
        enabled: !!orgUnitId,
        select: (data) => data.orgUnit,
    })

    return {
        loading,
        error,
        data,
    }
}
