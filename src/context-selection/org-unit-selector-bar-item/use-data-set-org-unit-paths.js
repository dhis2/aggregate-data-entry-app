import { useQuery } from 'react-query'
import { useDataSetId } from '../use-context-selection/index.js'

export default function useDataSetOrgUnitPaths() {
    const [dataSetId] = useDataSetId()
    const queryKey = [
        {
            dataSet: {
                resource: 'dataSets',
                id: dataSetId,
                params: {
                    fields: ['organisationUnits[path]'],
                },
            },
        },
    ]
    const {
        isLoading: loading,
        error,
        data,
    } = useQuery(queryKey, {
        enabled: !!dataSetId,
        select: (data) =>
            data.dataSet.organisationUnits.map(({ path }) => path),
    })

    return {
        data,
        loading,
        error,
    }
}
