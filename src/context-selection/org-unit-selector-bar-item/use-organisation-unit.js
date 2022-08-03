import { useQuery } from 'react-query'
import { useOrgUnitId } from '../../shared/index.js'

export default function useOrgUnit() {
    const [id] = useOrgUnitId()
    const queryKey = [
        'organisationUnits',
        {
            id,
            params: {
                fields: ['id', 'displayName', 'path'],
            },
        },
    ]
    const {
        isLoading: loading,
        error,
        data,
    } = useQuery(queryKey, {
        enabled: !!id,
    })

    return {
        loading,
        error,
        data,
    }
}
