import { useQuery } from 'react-query'
import { useDataSetId } from '../use-context-selection/index.js'

export default function useDataSetPeriodType() {
    const [dataSetId] = useDataSetId()
    const queryKey = [
        {
            dataSet: {
                resource: 'dataSets',
                id: dataSetId,
                params: {
                    fields: ['periodType'],
                },
            },
        },
    ]
    const {
        isIdle,
        isLoading: loading,
        error,
        data,
    } = useQuery(queryKey, {
        enabled: !!dataSetId,
        select: (data) => data.dataSet.periodType,
    })

    return {
        called: !isIdle,
        loading,
        error,
        data,
    }
}
