import { useDataQuery } from '@dhis2/app-runtime'
import { useEffect } from 'react'
import { useOrgUnitId } from '../use-context-selection.js'

const QUERY_ORG_UNIT = {
    orgUnit: {
        resource: 'organisationUnits',
        id: ({ id }) => id,
        params: {
            fields: ['id', 'displayName', 'path'],
        },
    },
}

export default function useOrgUnit() {
    const [orgUnitId] = useOrgUnitId()
    const { loading, error, refetch, data } = useDataQuery(QUERY_ORG_UNIT, {
        lazy: true,
    })

    useEffect(() => {
        if (orgUnitId) {
            refetch({ id: orgUnitId })
        }
    }, [orgUnitId])

    const orgUnit = data?.orgUnit

    return {
        loadingOrgUnit: loading,
        errorOrgUnit: error,
        orgUnit,
    }
}
