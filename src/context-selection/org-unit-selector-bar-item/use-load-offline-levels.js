import { useDataEngine } from '@dhis2/app-runtime'
import { useEffect, useState } from 'react'
import loadOfflineLevel from './load-offline-level.js'
import useOfflineLevelsToLoad from './use-offline-levels-to-load.js'
import useOrganisationUnitLevels from './use-organisation-unit-levels.js'

const loadAllOfflineLevels = ({
    dataEngine,
    offlineLevelsToLoadData,
    onDone,
}) => {
    const allRequests = offlineLevelsToLoadData.map((offlineLevelToLoad) =>
        loadOfflineLevel({
            dataEngine,
            ...offlineLevelToLoad,
        })
    )

    Promise.all(allRequests).finally(() => {
        // @TODO: Think about what should happen here
        // Do we want to notify the user about success?
        // What do we want to display when an error occurs?
        onDone()
    })
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
                onDone: () => setDone(true),
            })
        }
    }, [dataEngine, offlineLevelsToLoadData, setDone])

    return done
}
