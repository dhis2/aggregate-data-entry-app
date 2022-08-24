import { useQuery } from '@tanstack/react-query'

export default function useUserOrgUnits() {
    const {
        isLoading: loading,
        error,
        data,
    } = useQuery(
        [
            'me',
            {
                params: {
                    fields: ['organisationUnits[id]'],
                },
            },
        ],
        {
            select: (data) => data.organisationUnits.map(({ id }) => id),
        }
    )

    return {
        data,
        loading,
        error,
    }
}
