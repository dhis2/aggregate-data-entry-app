import { useDataEngine } from '@dhis2/app-runtime'
import { useEffect, useState } from 'react'
import loadOfflineLevel from './load-offline-level.js'
import useOfflineLevelsToLoad from './use-offline-levels-to-load.js'
import useOrganisationUnitLevels from './use-organisation-unit-levels.js'

function loadAllOfflineLevels({ dataEngine, offlineLevelsToLoadData }) {
    return Promise.all(
        offlineLevelsToLoadData.map((offlineLevelToLoad) => {
            console.log('> loadAllOfflineLevels -> offlineLevelToLoad:', offlineLevelToLoad)
            return loadOfflineLevel({
                dataEngine,
                ...offlineLevelToLoad,
            })
        })
    )
}

/**
 * As the service worker caches request responses,
 * it should suffice to simply perform all request the org unit tree would
 * perform as well in advance
 */
export default function useLoadOfflineLevels() {
    const [done, setDone] = useState(false)
    const dataEngine = useDataEngine()
    const organisationUnitLevels = useOrganisationUnitLevels()
    const offlineLevelsToLoad = useOfflineLevelsToLoad(
        organisationUnitLevels.data
    )
    const { data: offlineLevelsToLoadData } = offlineLevelsToLoad

    useEffect(() => {
        // Can't pass async function to useEffect
        if (offlineLevelsToLoadData) {
            loadAllOfflineLevels({
                dataEngine,
                offlineLevelsToLoadData,
            }).finally(() => {
                // @TODO: Think about what should happen here
                // Do we want to notify the user about success?
                // What do we want to display when an error occurs?
                setDone(true)
            })
        }
    }, [dataEngine, offlineLevelsToLoadData, setDone])

    return done
}
