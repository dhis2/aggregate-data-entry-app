import { useQuery } from 'react-query'

export const useAttributeMetadata = () => {
    const queryKey = [
        'categoryOptionCombos',
        {
            params: {
                fields: 'id,categoryOptions~pluck,categoryCombo[id],name',
                filter: 'categoryCombo.dataDimensionType:eq:ATTRIBUTE',
                paging: false,
            },
        },
    ]

    const query = useQuery(queryKey, {
        refetchOnMount: false,
    })

    return query
}
