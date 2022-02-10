import { useQuery } from 'react-query'
import { useDataSetId } from '../use-context-selection/index.js'

export default function useDataSetOrgUnitPaths() {
    const [id] = useDataSetId()
    const queryKey = [
        'dataSets',
        {
            id,
            params: {
                fields: ['organisationUnits[path]'],
            },
        },
    ]
    const {
        isLoading: loading,
        error,
        data,
    } = useQuery(queryKey, {
        enabled: !!id,
        select: (data) => data.organisationUnits.map(({ path }) => path),
    })

    return {
        data,
        loading,
        error,
    }
}
