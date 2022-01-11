import { useQuery } from 'react-query'
import { useDataSetId } from '../use-context-selection/index.js'

const QUERY_DATA_SET_SECTIONS_INFO = {
    dataSet: {
        resource: 'dataSets',
        id: ({ id }) => id,
        params: {
            fields: ['formType', 'sections[id,displayName]'],
        },
    },
}

export default function useDataSetSectionsInfo() {
    const [dataSetId] = useDataSetId()
    const queryKey = [QUERY_DATA_SET_SECTIONS_INFO, { id: dataSetId }]
    const {
        isIdle,
        isLoading: loading,
        error,
        data,
    } = useQuery(queryKey, { enabled: !!dataSetId })

    const menuOptions = data?.dataSet.sections.map(
        ({ id, displayName }) => ({
            value: id,
            label: displayName,
        })
    )

    return {
        called: !isIdle,
        loading,
        error,
        data: data && { ...data.dataSet },
        menuOptions,
    }
}
