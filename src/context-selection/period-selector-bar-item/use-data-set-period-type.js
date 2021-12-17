import { useDataQuery } from '@dhis2/app-runtime'
import { useEffect } from 'react'
import { useDataSetId } from '../use-context-selection.js'

const QUERY_DATA_SET = {
    dataSet: {
        resource: 'dataSets',
        id: ({ id }) => id,
        params: {
            fields: ['periodType'],
        },
    },
}

export default function useDataSetPeriodType() {
    const [dataSetId] = useDataSetId()
    const { loading, error, refetch, data } = useDataQuery(QUERY_DATA_SET, {
        lazy: true,
    })

    useEffect(() => {
        if (dataSetId) {
            refetch({ id: dataSetId })
        }
    }, [dataSetId])

    const dataSetPeriodType = data?.dataSet.periodType

    return {
        loadingDataSetPeriodType: loading,
        errorDataSetPeriodType: error,
        dataSetPeriodType,
    }
}
