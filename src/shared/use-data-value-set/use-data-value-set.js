import { useQuery, useIsMutating } from '@tanstack/react-query'
import { useMemo } from 'react'
import { createSelector } from 'reselect'
import { defaultOnSuccess } from '../../shared/default-on-success.js'
import { useHostDataValues } from '../embedded/index.js'
import { useIsValidSelection } from '../use-context-selection/index.js'
import useDataValueSetQueryKey from './use-data-value-set-query-key.js'

// Form value object structure: { [dataElementId]: { [cocId]: value } }
function mapDataValuesToFormInitialValues(dataValues) {
    // It's possible for the backend to return a response
    // that does not have dataValues
    if (!dataValues) {
        return {}
    }

    const formInitialValues = dataValues.reduce((acc, dataValueData) => {
        if (!acc[dataValueData.dataElement]) {
            acc[dataValueData.dataElement] = {
                [dataValueData.categoryOptionCombo]: dataValueData,
            }
        } else {
            acc[dataValueData.dataElement][dataValueData.categoryOptionCombo] =
                dataValueData
        }

        return acc
    }, {})
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
    const hostDataValues = useHostDataValues()

    const result = useQuery(queryKey, {
        // TODO: Disable if disconnected from DHIS2 server?
        enabled: !hostDataValues && !isMutating && isValidSelection,
        staleTime: Infinity,
        select: select,
        refetchOnReconnect: false,
        meta: { persist: true },
        onSuccess: defaultOnSuccess(onSuccess),
    })

    // values from an embedding app are shown as they are, never fetched.
    // They needn't be a full response: the rest is what the server sends when
    // there is nothing to say (e.g. min-max limits mean nothing for totals)
    const hostResult = useMemo(
        () =>
            hostDataValues && {
                data: select({
                    dataValues: [],
                    minMaxValues: [],
                    completeStatus: { complete: false },
                    ...hostDataValues,
                }),
                error: null,
                status: 'success',
                isSuccess: true,
                isError: false,
                isLoading: false,
                isInitialLoading: false,
                isFetching: false,
                isPaused: false,
                refetch: () => Promise.resolve(),
            },
        [hostDataValues]
    )

    return hostResult ?? result
}
