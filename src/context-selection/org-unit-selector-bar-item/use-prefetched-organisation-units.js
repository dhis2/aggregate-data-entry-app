import { useQueries } from '@tanstack/react-query'

const computeDeepestLevel = (rootLevel, offlineLevels, configOfflineLevel) => {
    if (offlineLevels) {
        return rootLevel + offlineLevels - 1
    }
    if (configOfflineLevel) {
        return configOfflineLevel
    }
    return 1
}

const computeOfflineLevels = (
    userOrgUnitRoot,
    filledOrganisationUnitLevels,
    configOfflineOrgUnitLevel
) => {
    const filledOrganisationUnitLevel = filledOrganisationUnitLevels.find(
        (level) => level === userOrgUnitRoot.level
    )
    const deepestLevel = computeDeepestLevel(
        userOrgUnitRoot,
        filledOrganisationUnitLevel?.offlineLevels,
        configOfflineOrgUnitLevel
    )

    return Array.from(
        { length: deepestLevel - userOrgUnitRoot.level + 1 },
        (_, i) => userOrgUnitRoot.level + i
    )
}

const useOfflineLevels = () => {
    const results = useQueries({
        queries: [
            {
                queryKey: [
                    'me',
                    {
                        params: {
                            fields: ['organisationUnits[id,level,path]'],
                        },
                    },
                ],
                select: (data) =>
                    data.organisationUnits.map(({ id, level }) => ({
                        id,
                        level,
                    })),
            },
            {
                queryKey: [
                    'filledOrganisationUnitLevels',
                    {
                        params: {
                            // @TODO: api ignores the `fields` query param
                            // See: https://jira.dhis2.org/browse/TECH-973
                            fields: ['level', 'offlineLevels'],
                        },
                    },
                ],
                select: (data) =>
                    data.map(({ id, level, offlineLevels }) => ({
                        id,
                        level,
                        offlineLevels,
                    })),
            },
            {
                queryKey: ['configuration/offlineOrganisationUnitLevel'],
                select: ({ level }) => level,
            },
        ],
    })
    const loading = results.some(({ isLoading }) => isLoading)
    const error = results.find(({ error }) => error)
    const [
        userOrgUnitRoots,
        filledOrganisationUnitLevels,
        configOfflineOrgUnitLevel,
    ] = results.map(({ data }) => data)

    return {
        loading,
        error,
        offlineLevels:
            !loading && !error
                ? userOrgUnitRoots.map((userOrgUnitRoot) => ({
                      id: userOrgUnitRoot.id,
                      offlineLevels: computeOfflineLevels(
                          userOrgUnitRoot,
                          filledOrganisationUnitLevels,
                          configOfflineOrgUnitLevel
                      ),
                  }))
                : undefined,
    }
}

const createPrefetchQueryArgs = ({ id, offlineLevels }) => ({
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
        queries: offlineLevels?.map(createPrefetchQueryArgs) ?? [],
    })

    const anyLoading = loading || results.some(({ isLoading }) => isLoading)
    const anyError = error || results.find(({ error }) => error)
    return {
        loading: anyLoading,
        error: anyError,
        data:
            !anyLoading && !anyError
                ? results.reduce((acc, { data }) => acc.concat(data), [])
                : undefined,
    }
}
