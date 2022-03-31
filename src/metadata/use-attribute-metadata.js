import { useQuery } from 'react-query'

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

const queryOpts = {
    refetchOnMount: false,
}

export const useAttributeMetadata = () => {
    const query = useQuery(queryKey, queryOpts)
    return query
}
