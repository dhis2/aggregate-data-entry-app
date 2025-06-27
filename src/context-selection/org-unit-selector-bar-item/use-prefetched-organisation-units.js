import { useQueries } from '@tanstack/react-query'
import { useFeatureToggleContext } from '../../shared/index.js'
import useOfflineLevels from './use-offline-levels.js'

const createPrefetchQueryArgs = ([path, offlineLevels]) => {
    const id = path.split('/').pop()
    return {
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
        // the response will be a single representation of an orgUnit if length === 1
        // the selector logic patches to return consistent format
        // to revert when backend is fixed: see https://dhis2.atlassian.net/browse/DHIS2-13901
        select: (results) =>
            Array.isArray(results.organisationUnits)
                ? results.organisationUnits
                : [results],
    }
}

const createGistPrefetchQueryArgs = ([path, offlineLevels]) => ({
    queryKey: [
        'organisationUnits/gist',
        {
            params: {
                orgUnitsOffline: true,
                filter: [
                    `level:in:[${offlineLevels?.join()}]`,
                    `path:startsWith:${path}`,
                ],
            },
        },
    ],
    enabled: Boolean(path && offlineLevels?.length >= 1),
    select: (results) =>
        results.organisationUnits.map(({ displayName, path, children }) => ({
            displayName,
            id: path.split('/').at(-1),
            path,
            children: children ? 1 : 0,
            level: path.split('/').length,
        })),
})

export default function usePrefetchedOrganisationUnits() {
    const { utilizeGistApiForPrefetchedOrganisationUnits } =
        useFeatureToggleContext()
    const { loading, error, offlineLevels } = useOfflineLevels()
    const queryToUse = utilizeGistApiForPrefetchedOrganisationUnits
        ? createGistPrefetchQueryArgs
        : createPrefetchQueryArgs
    const results = useQueries({
        queries: Object.entries(offlineLevels ?? {}).map(queryToUse),
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
