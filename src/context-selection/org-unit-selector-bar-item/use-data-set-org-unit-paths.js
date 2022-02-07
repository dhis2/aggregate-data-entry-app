import { useQuery } from 'react-query'
import { useDataSetId } from '../use-context-selection/index.js'

const QUERY_DATA_SET_ORG_UNIT_PATHS = {
    dataSet: {
        resource: 'dataSets',
        id: ({ id }) => id,
        params: {
            fields: ['organisationUnits[path]'],
        },
    },
}

export default function useDataSetOrgUnitPaths() {
    const [dataSetId] = useDataSetId()
    const queryKey = [QUERY_DATA_SET_ORG_UNIT_PATHS, { id: dataSetId }]
    const {
        isLoading: loading,
        error,
        data,
    } = useQuery(queryKey, { enabled: !!dataSetId })

    const dataSetOrgUnitPaths = data?.dataSet?.organisationUnits?.map(
        ({ path }) => path
    )

    return {
        data: dataSetOrgUnitPaths,
        loading,
        error,
    }
}
