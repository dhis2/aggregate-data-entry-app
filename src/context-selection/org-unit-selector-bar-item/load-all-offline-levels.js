import i18n from '@dhis2/d2-i18n'
import loadOfflineLevel from './load-offline-level.js'

export default function loadAllOfflineLevels({
    dataEngine,
    offlineLevelsToLoadData,
}) {
    return Promise.all(
        offlineLevelsToLoadData.map((offlineLevelToLoad) => {
            return loadOfflineLevel({
                dataEngine,
                ...offlineLevelToLoad,
            }).catch(() => {
                throw new Error(
                    i18n.t("We couldn't pre-load organisation with id {{id}}", {
                        id: offlineLevelToLoad.id,
                    })
                )
            })
        })
    )
}
