import { useQuery, onlineManager } from 'react-query'
import { useDataSetId } from '../use-context-selection/index.js'

const QUERY_DATA_SET_SECTIONS_INFO = {
    dataSet: {
        resource: 'dataSets',
        id: ({ id }) => id,
        params: {
            fields: ['formType', 'sections[id,displayName]', 'renderAsTabs'],
        },
    },
}

export default function useDataSetSectionsInfo() {
    const isOnline = onlineManager.isOnline()
    const [dataSetId] = useDataSetId()
    const queryKey = [QUERY_DATA_SET_SECTIONS_INFO, { id: dataSetId }]
    const {
        isIdle,
        isLoading: loading,
        error,
        data,
    } = useQuery(queryKey, { enabled: !!dataSetId && isOnline })

    const dataSet = data?.dataSet

    return {
        called: !isIdle,
        data: dataSet,
        loading,
        error,
    }
}
