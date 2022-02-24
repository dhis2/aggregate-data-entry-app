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

export const QUERY_ORG_CHILDREN_FROM_UI = {
    orgUnit: {
        resource: `organisationUnits`,
        id: ({ id }) => id,
        params: {
            fields: ['children[id,path,displayName]'],
        },
    },
}

export default async function loadOfflineLevel({
    dataEngine,
    id,
    offlineLevels,
}) {
    const variables = { id }
    const orgData = await dataEngine.query(QUERY_ORG_UNIT_FROM_UI, {
        variables,
    })
    const { children: childrenSize } = orgData.orgUnit
    const nextOfflineLevels = offlineLevels - 1

    let children
    if (childrenSize) {
        const orgChildren = await dataEngine.query(QUERY_ORG_CHILDREN_FROM_UI, {
            variables,
        })
        children = orgChildren.orgUnit.children
    }

    if (
        children &&
        // nextOfflineLevels = 0 -> Load the org unit but not its children
        nextOfflineLevels >= 0
    ) {
        for (const child of children) {
            // recursively load the offline levels
            await loadOfflineLevel({
                dataEngine,
                id: child.id,
                offlineLevels: nextOfflineLevels,
            })
        }
    }
}
