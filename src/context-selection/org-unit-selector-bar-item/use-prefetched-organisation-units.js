import { useQuery } from '@tanstack/react-query'
import useLoadConfigOfflineOrgUnitLevel from './use-load-config-offline-org-unit-level.js'
import useOrganisationUnitLevels from './use-organisation-unit-levels.js'
import useUserOrgUnits from './use-user-org-units.js'

const computeOfflineLevels = (
    userOrgUnits,
    organisationUnitLevels,
    configOfflineOrgUnitLevel
) => {
    // Highest as in at the top of the hierarchy, so this is actually the lowest number
    const userHighestLevel = Math.min(...userOrgUnits.map((unit) => unit.level))
    const userOfflineOrganisationUnitLevel = organisationUnitLevels.find(
        (oul) => oul.level === userHighestLevel
    )
    const userOfflineLevels =
        // base: read offline levels from user org-unit-level
        userOfflineOrganisationUnitLevel.offlineLevels ??
        // fallback: use offline levels from system-config
        configOfflineOrgUnitLevel.level ??
        // theoretical: prefetch at least the user org-unit-level
        1

    return Array.from(
        { length: userOfflineLevels - userHighestLevel + 1 },
        (_, i) => userHighestLevel + i
    )
}

/**
 * As the service worker caches request responses,
 * it should suffice to simply perform all request the org unit tree would
 * perform as well in advance
 */
export default function usePrefetchedOrganisationUnits() {
    const userOrgUnits = useUserOrgUnits()
    const organisationUnitLevels = useOrganisationUnitLevels()
    const configOfflineOrgUnitLevel = useLoadConfigOfflineOrgUnitLevel()
    const offlineLevels =
        userOrgUnits.data &&
        organisationUnitLevels.data &&
        configOfflineOrgUnitLevel.data
            ? computeOfflineLevels(
                  userOrgUnits.data.organisationUnits,
                  organisationUnitLevels.data,
                  configOfflineOrgUnitLevel.data
              )
            : []
    const offlineUnits = useQuery(
        [
            'organisationUnits',
            {
                params: {
                    fields: [
                        'id',
                        'displayName',
                        'path',
                        'children::size',
                        'level',
                    ],
                    paging: false,
                    filter: `level:in:[${offlineLevels.join()}]`,
                },
            },
        ],
        {
            enabled: offlineLevels.length > 1,
        }
    )

    return {
        organisationUnits: offlineUnits.data?.organisationUnits,
        offlineLevels: offlineLevels?.[offlineLevels.length - 1],
        loading:
            offlineUnits.isLoading ||
            userOrgUnits.loading ||
            organisationUnitLevels.loading ||
            configOfflineOrgUnitLevel.loading,
        error:
            offlineUnits.error ||
            userOrgUnits.error ||
            organisationUnitLevels.error ||
            configOfflineOrgUnitLevel.error,
    }
}
