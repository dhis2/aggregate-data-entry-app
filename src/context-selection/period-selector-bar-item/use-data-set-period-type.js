import { useQuery } from 'react-query'
import { useDataSetId } from '../use-context-selection/index.js'

const QUERY_DATA_SET = {
    dataSet: {
        resource: 'dataSets',
        id: ({ id }) => id,
        params: {
            fields: ['periodType'],
        },
    },
}

export default function useDataSetPeriodType() {
    const [dataSetId] = useDataSetId()
    const queryKey = [QUERY_DATA_SET, { id: dataSetId }]
    const {
        isLoading: loading,
        error,
        data,
    } = useQuery(queryKey, { enabled: !!dataSetId })

    const dataSetPeriodType = data?.dataSet.periodType

    return {
        loading,
        error,
        data: dataSetPeriodType,
    }
}
