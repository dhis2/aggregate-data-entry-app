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
            })
        })
    )
}
