import { useQueries } from '@tanstack/react-query'

/**
 * `displayName` is locale-aware (falls back to `name` when there's no
 * translation)
 */
export default function useOrgUnitSearchField() {
    const [systemLocaleQuery, userLocaleQuery] = useQueries({
        queries: [
            { queryKey: ['systemSettings/keyDbLocale', {}] },
            { queryKey: ['userSettings/keyDbLocale', {}] },
        ],
    })

    const loading = systemLocaleQuery.isLoading || userLocaleQuery.isLoading
    const error = systemLocaleQuery.error || userLocaleQuery.error
    const localesMatch =
        !loading && !error && systemLocaleQuery.data === userLocaleQuery.data

    return {
        searchField: localesMatch ? 'name' : 'displayName',
        loading,
        error,
    }
}
