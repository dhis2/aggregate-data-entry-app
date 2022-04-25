import { useQuery } from 'react-query'
import { useDataSetId } from '../use-context-selection/index.js'

export default function useDataSet() {
    const [id] = useDataSetId()
    const queryKey = [
        'dataSets',
        {
            id,
            params: {
                fields: ['id', 'displayName'],
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
    })

    return {
        called: !isIdle,
        loading,
        error,
        data,
    }
}
