import { useQuery } from 'react-query'
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
            return getOfflineLevelsToLoad({
                userOrganisationUnits,
                organisationUnitLevels,
            })
        },
    })
}
