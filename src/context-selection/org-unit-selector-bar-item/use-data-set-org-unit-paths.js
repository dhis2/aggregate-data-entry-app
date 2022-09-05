import { useQuery } from '@tanstack/react-query'
import { useDataSetId } from '../../shared/index.js'

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
