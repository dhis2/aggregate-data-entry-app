import { useQuery } from '@tanstack/react-query'
import { useDataSetId } from '../../shared/index.js'

export default function useDataSetAdditionalInfo() {
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
                    // Only used for custom forms, but saves making another request to dataSets later.
                    // The field is empty for non-custom forms, so it's cheap to add
                    'dataEntryForm[id,htmlCode]',
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
        // We added this staleTime to reuse the same call for section info, to also get the HTML content for custom forms and avoid a second API call
        // 1 minute should be enough to take into account the amount of time users need to finish context selection,
        // without being too long as in to hinder form authors from seeing their changes while they're developing them
        staleTime: 1 * 60 * 1000,
    })

    return {
        called: !isIdle,
        data,
        loading,
        error,
    }
}
