import { useDataQuery } from '@dhis2/app-runtime'
import { useEffect } from 'react'
import { useDataSetId } from '../use-context-selection.js'

const QUERY_DATA_SET_ORG_UNIT_PATHS = {
    dataSet: {
        resource: 'dataSets',
        id: ({ id }) => id,
        params: {
            fields: ['organisationUnits[path]'],
        },
    },
}

export default function useDataSetOrgUnitPaths() {
    const [dataSetId] = useDataSetId()
    const { loading, error, data, refetch } = useDataQuery(
        QUERY_DATA_SET_ORG_UNIT_PATHS,
        { lazy: true }
    )

    useEffect(() => {
        if (dataSetId) {
            refetch({ id: dataSetId })
        }
    }, [dataSetId])

    const dataSetOrgUnitPaths = data?.dataSet.organisationUnits.map(
        ({ path }) => path
    )

    return {
        data: dataSetOrgUnitPaths,
        loading,
        error,
    }
}
