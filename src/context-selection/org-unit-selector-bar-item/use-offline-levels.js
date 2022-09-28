import { useQueries } from '@tanstack/react-query'

export const computeDeepestLevel = (
    rootLevel,
    offlineLevels,
    configOfflineLevel
) => {
    if (offlineLevels) {
        return rootLevel + offlineLevels - 1
    }
    if (configOfflineLevel) {
        return configOfflineLevel
    }
    return 1
}

export const computeOfflineLevels = (
    userOrgUnitRoot,
    filledOrganisationUnitLevels,
    configOfflineOrgUnitLevel
) => {
    const filledOrganisationUnitLevel = filledOrganisationUnitLevels.find(
        ({ level }) => level === userOrgUnitRoot.level
    )
    const deepestLevel = computeDeepestLevel(
        userOrgUnitRoot.level,
        filledOrganisationUnitLevel?.offlineLevels,
        configOfflineOrgUnitLevel
    )

    return Array.from(
        { length: deepestLevel - userOrgUnitRoot.level + 1 },
        (_, i) => userOrgUnitRoot.level + i
    )
}

export default function useOfflineLevels() {
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
                ? userOrgUnitRoots.reduce((acc, userOrgUnitRoot) => {
                      acc[userOrgUnitRoot.id] = computeOfflineLevels(
                          userOrgUnitRoot,
                          filledOrganisationUnitLevels,
                          configOfflineOrgUnitLevel
                      )
                      return acc
                  }, {})
                : undefined,
    }
}
