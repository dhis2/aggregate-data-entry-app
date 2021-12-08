import { useDataQuery } from '@dhis2/app-runtime'

const QUERY_SELECTABLE_DATA_SETS = {
    dataSets: {
        resource: 'dataSets',
        params: {
            paging: false,
        },
    },
}

const useSelectableDataSets = () => {
    const { fetching, error, data } = useDataQuery(QUERY_SELECTABLE_DATA_SETS)

    // @TODO: How to handle pages / large lists?
    // Nested as this is "page-able"
    const selectableDataSets = data?.dataSets?.dataSets.map((dataSet) => ({
        ...dataSet,
        // Making sure these can be options as well
        value: dataSet.id,
        label: dataSet.displayName,
    }))

    return {
        fetchingSelectableDataSets: fetching,
        errorSelectableDataSets: error,
        selectableDataSets,
    }
}

export default useSelectableDataSets
