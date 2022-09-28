import { useQueries } from '@tanstack/react-query'
import useOfflineLevels from './use-offline-levels.js'

const createPrefetchQueryArgs = ([id, offlineLevels]) => ({
    queryKey: [
        'organisationUnits',
        {
            id,
            params: {
                fields: [
                    'id',
                    'displayName',
                    'path',
                    'children::size',
                    'level',
                ],
                includeDescendants: true,
                paging: false,
                filter: `level:in:[${offlineLevels?.join()}]`,
            },
        },
    ],
    enabled: Boolean(id && offlineLevels?.length >= 1),
    select: ({ organisationUnits }) => organisationUnits,
})

export default function usePrefetchedOrganisationUnits() {
    const { loading, error, offlineLevels } = useOfflineLevels()
    const results = useQueries({
        queries: Object.entries(offlineLevels ?? {}).map(
            createPrefetchQueryArgs
        ),
    })

    const anyLoading = loading || results.some(({ isLoading }) => isLoading)
    const anyError = error || results?.find(({ error }) => error)
    return {
        loading: anyLoading,
        error: anyError,
        offlineOrganisationUnits:
            !anyLoading && !anyError
                ? results.reduce((acc, { data }) => acc.concat(data), [])
                : undefined,
        offlineLevels,
    }
}
