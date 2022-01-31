import { useQuery } from 'react-query'

export default function useSelectableDataSets({ onSuccess }) {
    const queryKey = [
        'dataSets',
        {
            params: {
                paging: false,
            },
        },
    ]
    const {
        isIdle,
        isLoading: loading,
        error,
        data,
    } = useQuery(queryKey, {
        onSuccess,

        // @TODO: How to handle pages / large lists?
        // Nested as this is "page-able"
        select: (data) =>
            data.dataSets.map((dataSet) => ({
                ...dataSet,
                // Making sure these can be options as well
                value: dataSet.id,
                label: dataSet.displayName,
            })),
    })

    return {
        called: !isIdle,
        loading,
        error,
        data,
    }
}