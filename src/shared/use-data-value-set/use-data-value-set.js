import { useQuery, useIsMutating } from '@tanstack/react-query'
import { createSelector } from 'reselect'
import { defaultOnSuccess } from '../../shared/default-on-success.js'
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
        const completeStatus = data.completeStatus
        const dataValues = mapDataValuesToFormInitialValues(data.dataValues)
        const minMaxValues = data.minMaxValues || {}
        const lockStatus = data.lockStatus || ''
        return { completeStatus, dataValues, minMaxValues, lockStatus }
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

    const isMutating = useIsMutating(queryKey[0]) > 0

    const result = useQuery(queryKey, {
        // TODO: Disable if disconnected from DHIS2 server?
        enabled: !isMutating && isValidSelection,
        staleTime: Infinity,
        select: select,
        refetchOnMount: false,
        refetchOnReconnect: false,
        meta: { persist: true },
        onSuccess: defaultOnSuccess(onSuccess),
    })

    return result
}
