import { useQuery } from 'react-query'
import { useDataSetId } from '../use-context-selection/index.js'

export default function useDataSetSectionsInfo() {
    const [dataSetId] = useDataSetId()
    const queryKey = [
        {
            dataSet: {
                resource: 'dataSets',
                id: dataSetId,
                params: {
                    fields: [
                        'formType',
                        'sections[id,displayName]',
                        'renderAsTabs',
                    ],
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
        select: (data) => data.dataSet,
    })

    return {
        called: !isIdle,
        data,
        loading,
        error,
    }
}
