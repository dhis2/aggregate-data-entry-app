import { useQuery } from '@tanstack/react-query'
import { useDataSetId } from '../../shared/index.js'

export default function useDataSetSectionsInfo() {
    const [id] = useDataSetId()
    const queryKey = [
        'dataSets',
        {
            id,
            params: {
                fields: [
                    'formType',
                    'sections[id,displayName]',
                    'renderAsTabs',
                ],
            },
        },
    ]
    const {
        isIdle,
        isLoading: loading,
        error,
        data,
    } = useQuery(queryKey, {
        enabled: !!id,
    })

    return {
        called: !isIdle,
        data,
        loading,
        error,
    }
}
