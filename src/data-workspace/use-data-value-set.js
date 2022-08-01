import { useQuery, useIsMutating } from 'react-query'
import { useIsValidSelection } from '../context-selection/index.js'
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
                followup,
                lastUpdated,
            }
        ) => {
            const dataValueData = {
                value,
                dataElement,
                comment,
                storedBy,
                followup,
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

/**
 * If this query is used while offline, since it uses networkMode = 'online',
 * the query will be PAUSED and its data will be undefined. 
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
export const useDataValueSet = () => {
    const isValidSelection = useIsValidSelection()
    const queryKey = useDataValueSetQueryKey()
    const activeMutations = useIsMutating({ mutationKey: queryKey })

    const result = useQuery(queryKey, {
        // Only enable this query if there are no ongoing mutations
        enabled: activeMutations === 0 && isValidSelection,
        select: (data) => {
            const dataValues = mapDataValuesToFormInitialValues(data.dataValues)
            const minMaxValues = data.minMaxValues || {}
            return { dataValues, minMaxValues }
        },
        // // Only fetch whilst offline, to prevent optimistic updates from being overwritten
        networkMode: 'online',
        meta: {
            persist: true,
        },
    })

    return result
}
