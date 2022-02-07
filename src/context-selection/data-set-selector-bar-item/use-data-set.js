import { useQuery } from 'react-query'
import { useDataSetId } from '../use-context-selection/index.js'

const QUERY_DATA_SET = {
    dataSet: {
        resource: 'dataSets',
        id: ({ id }) => id,
        params: {
            fields: ['id', 'displayName'],
        },
    },
}

export default function useDataSet() {
    const [dataSetId] = useDataSetId()
    const {
        isIdle,
        isLoading: loading,
        error,
        data,
    } = useQuery([QUERY_DATA_SET, { id: dataSetId }], {
        enabled: !!dataSetId,
    })

    return {
        called: !isIdle,
        loading,
        error,
        data: data?.dataSet,
    }
}
