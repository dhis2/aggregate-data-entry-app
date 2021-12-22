import { useDataQuery } from '@dhis2/app-runtime'
import { useEffect } from 'react'
import { useDataSetId } from '../use-context-selection.js'

const QUERY_DATA_SET_SECTIONS_INFO = {
    dataSet: {
        resource: 'dataSets',
        id: ({ id }) => id,
        params: {
            fields: ['formType', 'sections[id,displayName]'],
        },
    },
}

export default function useDataSetSectionsInfo() {
    const [dataSetId] = useDataSetId()
    const { called, loading, error, refetch, data } = useDataQuery(
        QUERY_DATA_SET_SECTIONS_INFO,
        { lazy: true }
    )

    useEffect(() => {
        if (dataSetId) {
            refetch({ id: dataSetId })
        }
    }, [dataSetId])

    const dataSetSectionsInfo = data?.dataSet.sections.map(
        ({ id, displayName }) => ({
            value: id,
            label: displayName,
        })
    )

    return {
        called,
        loading,
        error,
        data: dataSetSectionsInfo,
    }
}
