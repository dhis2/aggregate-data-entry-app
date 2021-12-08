import { useDataQuery } from '@dhis2/app-runtime'
import { useEffect } from 'react'

const QUERY_DATA_SET = {
    dataSet: {
        resource: 'dataSets',
        id: ({ id }) => id,
        params: {
            fields: ['id', 'displayName'],
        },
    },
}

const useDataSet = (dataSetId) => {
    const { called, fetching, error, refetch, data } = useDataQuery(
        QUERY_DATA_SET,
        { lazy: true }
    )

    useEffect(() => {
        if (dataSetId) {
            refetch({ id: dataSetId })
        }
    }, [dataSetId])

    const dataSet = data?.dataSet

    return {
        calledDataSet: called,
        fetchingDataSet: fetching,
        errorDataSet: error,
        refetchDataSet: refetch,
        dataSet,
    }
}

export default useDataSet
