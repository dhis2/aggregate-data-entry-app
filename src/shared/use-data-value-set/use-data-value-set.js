import { useQuery } from '@tanstack/react-query'
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
        return { dataValues, minMaxValues }
    }
)

const meta = { persist: true }

export const useDataValueSet = () => {
    const isValidSelection = useIsValidSelection()
    const queryKey = useDataValueSetQueryKey()
    const result = useQuery(queryKey, {
        // Only enable this query if there are no ongoing mutations
        enabled: isValidSelection,
        select,
        //refetchOnMount: false,
        refetchOnMount: (query) => {
            // only refetch on mount if the query was just hydrated
            // this should only happen during initial app-load.
            // If we were to return 'false' the query would not be refetch on first mount
            // because it's mounted with hydrated-state
            return !!query.meta.isHydrated
        },
        // Only fetch whilst offline, to prevent optimistic updates from being overwritten
        networkMode: 'online',
        meta,
    })

    return result
}
