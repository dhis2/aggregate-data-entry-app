import { useQuery, useIsMutating } from '@tanstack/react-query'
import { useCallback } from 'react'
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

const selectDataValues = createSelector(
    (data) => data,
    (data) => {
        const dataValues = mapDataValuesToFormInitialValues(data.dataValues)
        const minMaxValues = data.minMaxValues || {}
        const lockStatus = data.lockStatus || ''
        return { dataValues, minMaxValues, lockStatus }
    }
)

const selectSingleDataValue = createSelector(
    (data) => data,
    (_, { dataElementId, categoryOptionComboId }) => ({
        dataElementId,
        categoryOptionComboId,
    }),
    (data, { dataElementId, categoryOptionComboId }) => {
        return data.dataValues?.find(
            (dv) =>
                dv.dataElement === dataElementId &&
                dv.categoryOptionCombo === categoryOptionComboId
        )
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
export const useDataValueSet = ({
    onSuccess,
    select = selectDataValues,
} = {}) => {
    const isValidSelection = useIsValidSelection()
    const queryKey = useDataValueSetQueryKey()
    const activeMutations = useIsMutating({ mutationKey: ['dataValues'] })

    const result = useQuery(queryKey, {
        // Only enable this query if there are no ongoing mutations
        // TODO: Disable if disconnected from DHIS2 server?
        enabled: activeMutations === 0 && isValidSelection,
        select,
        // Fetch once, no matter the network connectivity;
        // will be 'paused' if offline and the request fails.
        // Important to try the network when on offline/local DHIS2 implmnt'ns
        networkMode: 'offlineFirst',
        refetchOnMount: (query) => {
            // only refetch on mount if the query was just hydrated
            // this should only happen during initial app-load.
            // If we were to return 'false' the query would not be refetch on first mount
            // because it's mounted with hydrated-state
            return !!query.meta?.isHydrated
        },
        meta: { persist: true },
        onSuccess,
    })

    return result
}

export const useDataValuesWithSelector = (selector) => {
    // note we cannot re-use useDataValueSet() above due to additional re-renders from useIsMutating()
    const queryKey = useDataValueSetQueryKey()
    // this query should always be called after dataValue is loaded by hook above
    // Since this uses the cache only.
    // The reason for this is that we do not want calls to this to refetch or
    // trigger cache-updates (without meta.persist=true)
    const { data } = useQuery(queryKey, {
        // disable fetching of query, is handled by useDataValueSet above
        enabled: false,
        select: selector,
    })
    return data
}

export const useSingleDataValue = ({
    dataElementId,
    categoryOptionComboId,
}) => {
    const select = useCallback(
        (data) => {
            return selectSingleDataValue(data, {
                dataElementId,
                categoryOptionComboId,
            })
        },
        [dataElementId, categoryOptionComboId]
    )
    return useDataValuesWithSelector(select)
}
