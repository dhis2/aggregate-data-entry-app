import { useDataEngine } from '@dhis2/app-runtime'
import { useEffect, useState } from 'react'
import loadOfflineLevel from './load-offline-level.js'
import useOfflineLevelsToLoad from './use-offline-levels-to-load.js'
import useOrganisationUnitLevels from './use-organisation-unit-levels.js'

/**
 * As the service worker caches request responses,
 * it should suffice to simply perform all request the org unit tree would
 * perform as well in advance
 */
export default function useLoadOfflineLevels() {
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(undefined)
    const [data, setData] = useState(false)

    const dataEngine = useDataEngine()
    const organisationUnitLevels = useOrganisationUnitLevels()
    const offlineLevelsToLoad = useOfflineLevelsToLoad(organisationUnitLevels)
    const { data: offlineLevelsToLoadData } = offlineLevelsToLoad

    useEffect(() => {
        // Can't pass async function to useEffect
        offlineLevelsToLoadData &&
            (async () => {
                await Promise.all(
                    offlineLevelsToLoadData.map((offlineLevelToLoad) => {
                        const payload = {
                            dataEngine,
                            ...offlineLevelToLoad,
                        }

                        return loadOfflineLevel(payload)
                    })
                )
                    .then(() => setData(true))
                    .catch(setError)
                    .finally(() => setLoading(false))
            })()
    }, [dataEngine, offlineLevelsToLoadData, setLoading, setData])

    return { loading, error, data }
}
