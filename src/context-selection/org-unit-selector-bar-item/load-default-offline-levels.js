import i18n from '@dhis2/d2-i18n'
import loadAllOfflineLevels from './load-all-offline-levels.js'

// load paths from user's roots to the default level
export default async function loadDefaultOfflineLevels({
    dataEngine,
    userOrganisationUnits,
    configOfflineOrgUnitLevel,
}) {
    if (!userOrganisationUnits) {
        return Promise.reject(
            new Error(
                i18n.t(
                    "We couldn't pre-load organisation units for offline usage. Your user account is not assigned to any organisation unit. Please contact an administrator."
                )
            )
        )
    }

    if (!configOfflineOrgUnitLevel?.level) {
        return Promise.reject(
            new Error(
                i18n.t(
                    "We couldn't pre-load organisation units for offline usage. The default organisation unit offline level has not been configured. Please contact an administrator."
                )
            )
        )
    }

    const offlineLevelsToLoadData = userOrganisationUnits
        .filter(({ level }) => level < configOfflineOrgUnitLevel.level)
        .map(({ id, level }) => ({
            id,
            offlineLevels: configOfflineOrgUnitLevel.level - level,
        }))

    if (!offlineLevelsToLoadData.length) {
        return Promise.reject(
            new Error(
                i18n.t(
                    "We couldn't pre-load organisation units for offline usage. The default organisation unit offline level is lower than the level of the organisation unit(s) assigned to you."
                )
            )
        )
    }

    return loadAllOfflineLevels({ dataEngine, offlineLevelsToLoadData })
}
