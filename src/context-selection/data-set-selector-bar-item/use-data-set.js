import { useQuery } from 'react-query'
import { useDataSetId } from '../use-context-selection/index.js'

export default function useDataSet() {
    const [dataSetId] = useDataSetId()
    const {
        isIdle,
        isLoading: loading,
        error,
        data,
    } = useQuery(
        [
            {
                dataSet: {
                    resource: 'dataSets',
                    id: dataSetId,
                    params: {
                        fields: ['id', 'displayName'],
                    },
                },
            },
            { id: dataSetId },
        ],
        {
            enabled: !!dataSetId,
            select: (data) => data.dataSet,
        }
    )

    return {
        called: !isIdle,
        loading,
        error,
        data,
    }
}
