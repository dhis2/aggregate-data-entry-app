// Copied from https://github.com/dhis2/ui/blob/master/components/organisation-unit-tree/src/organisation-unit-node/use-org-data/use-org-data.js
export const QUERY_ORG_UNIT_FROM_UI = {
    orgUnit: {
        resource: `organisationUnits`,
        id: ({ id }) => id,
        params: ({ isUserDataViewFallback }) => ({
            isUserDataViewFallback,
            fields: ['path', 'children::size'],
        }),
    },
}

export default function loadOrgUnit(dataEngine, id) {
    const variables = { id }
    return dataEngine.query(QUERY_ORG_UNIT_FROM_UI, {
        variables,
    })
}
