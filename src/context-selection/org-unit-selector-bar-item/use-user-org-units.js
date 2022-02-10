import { useQuery } from 'react-query'

export default function useUserOrgUnits() {
    const {
        isLoading: loading,
        error,
        data,
    } = useQuery(
        [
            {
                orgUnits: {
                    resource: 'me',
                    params: {
                        fields: ['organisationUnits[id]'],
                    },
                },
            },
        ],
        {
            select: (data) =>
                data.orgUnits.organisationUnits.map(({ id }) => id),
        }
    )

    return {
        data,
        loading,
        error,
    }
}
