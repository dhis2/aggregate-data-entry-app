import { useQuery, useIsMutating } from '@tanstack/react-query'
import { useRef, useMemo } from 'react'
import { createSelector } from 'reselect'
import { useIsValidSelection } from '../use-context-selection/index.js'
import useDataValueSetQueryKey from './use-data-value-set-query-key.js'

// Form value object structure: { [dataElementId]: { [cocId]: value } }
function mapDataValuesToFormInitialValues(dataValues) {
    // It's possible for the backend to return a response
    // that does not have dataValues
    if (!dataValues) {
        return {}
    }

    const formInitialValues = dataValues.reduce(
        (
            acc,
            {
                dataElement,
                categoryOptionCombo,
                value,
                comment,
                storedBy,
                followUp,
                lastUpdated,
            }
        ) => {
            const dataValueData = {
                value,
                dataElement,
                comment,
                storedBy,
                followUp,
                lastUpdated,
            }

            if (!acc[dataElement]) {
                acc[dataElement] = { [categoryOptionCombo]: dataValueData }
            } else {
                acc[dataElement][categoryOptionCombo] = dataValueData
            }

            return acc
        },
        {}
    )
    return formInitialValues
}

const select = createSelector(
    (data) => data,
    (data) => {
        const dataValues = mapDataValuesToFormInitialValues(data.dataValues)
        const minMaxValues = data.minMaxValues || {}
        const lockStatus = data.lockStatus || ''
        return { dataValues, minMaxValues, lockStatus }
    }
)

/**
 * If this query is used while offline, since it uses the 'offlineFirst'
 * network mode, the query will be try once, then be PAUSED
 * and its data will be undefined.
 * Consumers will need to adapt accordingly to allow forms to load offline.
 *
 * Here are some values to expect while offline:
 * isPaused = true
 * isFetching = false
 * isLoading = true
 * data = undefined
 *
 * TODO: This is no longer using the dataValueSet endpoint; should rename.
 */
export const useDataValueSet = ({ onSuccess } = {}) => {
    const isValidSelection = useIsValidSelection()
    const queryKey = useDataValueSetQueryKey()
    const prevParamString = useRef(null)
    const activeMutations = useIsMutating({ mutationKey: ['dataValues'] })

    const isEnabled = useMemo(() => {
        const paramString = JSON.stringify(queryKey[1])
        if (
            prevParamString.current !== paramString &&
            activeMutations === 0 &&
            isValidSelection
        ) {
            prevParamString.current = paramString
            return true
        } else {
            return false
        }
    }, [activeMutations, queryKey, isValidSelection])

    const result = useQuery(queryKey, {
        // Only enable this query if there are no ongoing mutations
        // TODO: Disable if disconnected from DHIS2 server?
        enabled: isEnabled,
        select: select,
        // Fetch once, no matter the network connectivity;
        // will be 'paused' if offline and the request fails.
        // Important to try the network when on offline/local DHIS2 implmnt'ns
        networkMode: 'offlineFirst',
        refetchOnMount: (query) => {
            // only refetch on mount if the query was just hydrated
            // this should only happen during initial app-load.
            // If we were to return 'false' the query would not be refetch on first mount
            // because it's mounted with hydrated-state
            return !!query.meta.isHydrated
        },
        meta: { persist: true },
        onSuccess,
    })

    return result
}
