import loadOrgUnit from './load-org-unit.js'

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
    const orgData = await loadOrgUnit(dataEngine, id)
    const { children: childrenSize } = orgData.orgUnit
    const nextOfflineLevels = offlineLevels - 1

    if (!childrenSize) {
        return Promise.resolve()
    }

    const orgChildren = await dataEngine.query(QUERY_ORG_CHILDREN_FROM_UI, {
        variables: { id },
    })

    const children = orgChildren.orgUnit.children

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

    return Promise.resolve()
}
