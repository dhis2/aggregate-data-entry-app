import { useQuery } from 'react-query'

export default function useSelectableDataSets(onSuccess) {
    const {
        isIdle,
        isLoading: loading,
        error,
        data,
    } = useQuery(
        [
            {
                dataSets: {
                    resource: 'dataSets',
                    params: {
                        paging: false,
                    },
                },
            },
        ],
        {
            onSuccess,
            select: (data) =>
                // @TODO: How to handle pages / large lists?
                // Nested as this is "page-able"
                data.dataSets.dataSets.map((dataSet) => ({
                    ...dataSet,
                    // Making sure these can be options as well
                    value: dataSet.id,
                    label: dataSet.displayName,
                })),
        }
    )

    return {
        called: !isIdle,
        loading,
        error,
        data,
    }
}
