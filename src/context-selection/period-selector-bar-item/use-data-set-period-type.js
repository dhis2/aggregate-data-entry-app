import { useQuery } from 'react-query'
import { useDataSetId } from '../use-context-selection/index.js'

export default function useDataSetPeriodType() {
    const [id] = useDataSetId()
    const queryKey = [
        'dataSets',
        {
            id,
            params: {
                fields: ['periodType'],
            },
        },
    ]
    const {
        isIdle,
        isLoading: loading,
        error,
        data,
    } = useQuery(queryKey, {
        enabled: !!id,
        select: (data) => data.periodType,
    })

    return {
        called: !isIdle,
        loading,
        error,
        data,
    }
}
