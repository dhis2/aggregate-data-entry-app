import { useQuery } from '@tanstack/react-query'
import { useOrgUnitId } from '../../shared/index.js'

export default function useOrgUnit() {
    const [id] = useOrgUnitId()
    const queryKey = [
        'organisationUnits',
        {
            id,
            params: {
                fields: [
                    'id',
                    'displayName',
                    'path',
                    'openingDate',
                    'closedDate',
                ],
            },
        },
    ]
    const { isFetching, error, data } = useQuery(queryKey, {
        enabled: !!id,
    })

    return {
        loading: !data && isFetching,
        error,
        data,
    }
}
