import { useQuery } from '@tanstack/react-query'

export default function useLoadConfigOfflineOrgUnitLevel() {
    return useQuery(['configuration/offlineOrganisationUnitLevel'])
}
