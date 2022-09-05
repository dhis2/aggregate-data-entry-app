import { useQuery } from '@tanstack/react-query'

export default function useOrganisationUnitLevels() {
    const queryKey = [
        'filledOrganisationUnitLevels',
        {
            params: {
                // @TODO: api ignores the `fields` query param
                // See: https://jira.dhis2.org/browse/TECH-973
                fields: ['level', 'offlineLevels'],
            },
        },
    ]

    return useQuery(queryKey)
}
