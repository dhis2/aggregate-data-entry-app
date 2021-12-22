import { useDataQuery } from '@dhis2/app-runtime'
import { useEffect } from 'react'
import { useDataSetId } from '../use-context-selection.js'

const QUERY_CATEGORY_COMBINATION = {
    dataSet: {
        resource: 'dataSets',
        id: ({ id }) => id,
        params: {
            fields: [
                'categoryCombo[isDefault,displayName, categories[id, displayName, categoryOptions[id, displayName]]]',
            ],
        },
    },
}

export default function useCategoryCombination() {
    const [dataSetId] = useDataSetId()
    const { called, loading, error, refetch, data } = useDataQuery(
        QUERY_CATEGORY_COMBINATION,
        { lazy: true }
    )

    useEffect(() => {
        if (dataSetId) {
            refetch({ id: dataSetId })
        }
    }, [dataSetId])

    return {
        called,
        loading,
        error,
        refetch,
        data: data?.dataSet.categoryCombo,
    }
}
