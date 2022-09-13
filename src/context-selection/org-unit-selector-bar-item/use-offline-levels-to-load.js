import { useQuery } from '@tanstack/react-query'
import getOfflineLevelsToLoad from './get-offline-levels-to-load.js'

export default function useOfflineLevelsToLoad(organisationUnitLevels) {
    const queryKey = [
        'me',
        {
            params: {
                fields: 'organisationUnits[id,level]',
            },
        },
    ]

    return useQuery(queryKey, {
        // Only fetch the user's org units when there are any offline levels
        enable: organisationUnitLevels?.length,
        select: ({ organisationUnits: userOrganisationUnits }) => {
            return {
                userOrganisationUnits,
                offlineLevelsToLoad: getOfflineLevelsToLoad({
                    organisationUnitLevels,
                    userOrganisationUnits,
                }).filter(
                    // When changing an offline level to "default",
                    // this value is undefined and should be omitted
                    ({ offlineLevels }) => offlineLevels
                ),
            }
        },
    })
}
