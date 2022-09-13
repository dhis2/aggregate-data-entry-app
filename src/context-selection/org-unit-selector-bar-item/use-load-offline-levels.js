import { useDataEngine } from '@dhis2/app-runtime'
import { useEffect, useMemo, useState } from 'react'
import loadAllOfflineLevels from './load-all-offline-levels.js'
import loadDefaultOfflineLevels from './load-default-offline-levels.js'
import useLoadConfigOfflineOrgUnitLevel from './use-load-config-offline-org-unit-level.js'
import useOfflineLevelsToLoad from './use-offline-levels-to-load.js'
import useOrganisationUnitLevels from './use-organisation-unit-levels.js'

/**
 * Can either be an empty array or an array with configs
 * with the `offlineLevels` property as to `undefined`
 */
function isOfflineLevelsToLoadEmpty(offlineLevelsToLoad) {
    if (!offlineLevelsToLoad.length) {
        return true
    }

    // true = There is no offlineLevel that is defined
    return !offlineLevelsToLoad.find(({ offlineLevels }) => offlineLevels)
}

/**
 * As the service worker caches request responses,
 * it should suffice to simply perform all request the org unit tree would
 * perform as well in advance
 */
export default function useLoadOfflineLevels() {
    const { data: configOfflineOrgUnitLevel } =
        useLoadConfigOfflineOrgUnitLevel()
    const [done, setDone] = useState(false)
    const dataEngine = useDataEngine()
    const organisationUnitLevels = useOrganisationUnitLevels()
    const offlineLevelsToLoadQuery = useOfflineLevelsToLoad(
        organisationUnitLevels.data
    )

    const { data: offlineLevelToLoadData } = offlineLevelsToLoadQuery
    const { offlineLevelsToLoad, userOrganisationUnits } = useMemo(
        () => offlineLevelToLoadData || {},
        [offlineLevelToLoadData]
    )

    useEffect(() => {
        // Can't pass async function to useEffect
        if (
            configOfflineOrgUnitLevel &&
            isOfflineLevelsToLoadEmpty(offlineLevelsToLoad)
        ) {
            loadDefaultOfflineLevels({
                dataEngine,
                userOrganisationUnits,
                configOfflineOrgUnitLevel,
            }).finally(() => setDone(true))
        } else if (offlineLevelsToLoad) {
            loadAllOfflineLevels({
                dataEngine,
                offlineLevelsToLoadData: offlineLevelsToLoad,
            }).finally(() => setDone(true))
        }
    }, [
        dataEngine,
        offlineLevelsToLoad,
        setDone,
        configOfflineOrgUnitLevel,
        userOrganisationUnits,
    ])

    return done
}
