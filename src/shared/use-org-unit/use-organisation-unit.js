import { useQuery } from '@tanstack/react-query'
import { useOrgUnitId } from '../use-context-selection/index.js'

export const useOrgUnit = () => {
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
