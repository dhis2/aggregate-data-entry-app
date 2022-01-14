import { useQuery } from 'react-query'

const QUERY_SELECTABLE_DATA_SETS = {
    dataSets: {
        resource: 'dataSets',
        params: {
            paging: false,
        },
    },
}

export default function useSelectableDataSets(onSuccess) {
    const { isIdle, isLoading: loading, error, data } = useQuery(
        [QUERY_SELECTABLE_DATA_SETS],
        { onSuccess }
    )

    // @TODO: How to handle pages / large lists?
    // Nested as this is "page-able"
    const selectableDataSets = data?.dataSets?.dataSets.map((dataSet) => ({
        ...dataSet,
        // Making sure these can be options as well
        value: dataSet.id,
        label: dataSet.displayName,
    }))

    return {
        called: !isIdle,
        loading,
        error,
        data: selectableDataSets,
    }
}
