import { useQuery, onlineManager } from 'react-query'
import { useDataSetId } from '../use-context-selection/index.js'

const QUERY_CATEGORY_COMBINATION = {
    dataSet: {
        resource: 'dataSets',
        id: ({ id }) => id,
        params: {
            fields: [
                'categoryCombo[isDefault,displayName, categories[id, displayName, categoryOptions[id, displayName]]]',
            ],
        },
    },
}

export default function useCategoryCombination() {
    const isOnline = onlineManager.isOnline()
    const [dataSetId] = useDataSetId()
    const queryKey = [QUERY_CATEGORY_COMBINATION, { id: dataSetId }]
    const {
        isIdle,
        isLoading: loading,
        error,
        data,
    } = useQuery(queryKey, { enabled: !!dataSetId && isOnline })

    return {
        called: !isIdle,
        loading,
        error,
        data: data?.dataSet.categoryCombo,
    }
}
