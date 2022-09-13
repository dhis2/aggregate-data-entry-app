import loadAllOfflineLevels from './load-all-offline-levels.js'

// load paths from user's roots to the default level
export default async function loadDefaultOfflineLevels({
    dataEngine,
    userOrganisationUnits,
    configOfflineOrgUnitLevel,
}) {
    if (!userOrganisationUnits) {
        return Promise.resolve()
    }

    const offlineLevelsToLoadData = userOrganisationUnits
        .filter(({ level }) => level < configOfflineOrgUnitLevel.level)
        .map(({ id, level }) => {
            return {
                id,
                offlineLevels: configOfflineOrgUnitLevel.level - level,
            }
        })

    return loadAllOfflineLevels({ dataEngine, offlineLevelsToLoadData })
}
