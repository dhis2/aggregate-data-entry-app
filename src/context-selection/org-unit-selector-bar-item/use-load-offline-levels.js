import { useAlert, useDataEngine } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import { useEffect, useMemo, useRef, useState } from 'react'
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

const messageUserOrgUnitOutOfBounds = i18n.t(
    'Something went wrong while trying to pre-load organisation units for offline usage. Please try again later or contact an admin.'
)

/**
 * As the service worker caches request responses,
 * it should suffice to simply perform all request the org unit tree would
 * perform as well in advance
 */
export default function useLoadOfflineLevels() {
    const [done, setDone] = useState(false)
    const startedLoadingRef = useRef(false)
    const { show: showAlert } = useAlert(
        (message) => message,
        () => ({ warning: true })
    )
    const configOfflineOrgUnitLevel = useLoadConfigOfflineOrgUnitLevel()
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
        let promise
        const isLoading =
            organisationUnitLevels.isLoading ||
            offlineLevelsToLoadQuery.isLoading ||
            configOfflineOrgUnitLevel.isLoading

        if (isLoading) {
            // Do nothing when loading
        } else if (
            configOfflineOrgUnitLevel.data &&
            isOfflineLevelsToLoadEmpty(offlineLevelsToLoad) &&
            !startedLoadingRef.current
        ) {
            startedLoadingRef.current = true
            promise = loadDefaultOfflineLevels({
                dataEngine,
                userOrganisationUnits,
                configOfflineOrgUnitLevel: configOfflineOrgUnitLevel.data,
            })
        } else if (offlineLevelsToLoad && !startedLoadingRef.current) {
            startedLoadingRef.current = true
            promise = loadAllOfflineLevels({
                dataEngine,
                offlineLevelsToLoadData: offlineLevelsToLoad,
            })
        } else {
            startedLoadingRef.current = true
            promise = Promise.reject(new Error(messageUserOrgUnitOutOfBounds))
        }

        promise &&
            promise
                .catch((e) => {
                    console.error(e)
                    showAlert(e.message)
                })
                .finally(() => setDone(true))
    }, [
        configOfflineOrgUnitLevel.data,
        configOfflineOrgUnitLevel.isLoading,
        dataEngine,
        offlineLevelsToLoad,
        offlineLevelsToLoadQuery.isLoading,
        organisationUnitLevels.isLoading,
        setDone,
        showAlert,
        startedLoadingRef,
        userOrganisationUnits,
    ])

    return done
}
