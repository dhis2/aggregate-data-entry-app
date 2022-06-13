import { useQuery, useIsMutating } from 'react-query'
import {
    useContextSelection,
    useIsValidSelection,
} from '../context-selection/index.js'
import { dataValueSets } from './query-key-factory.js'

// Form value object structure: { [dataElementId]: { [cocId]: value } }
function mapDataValuesToFormInitialValues(dataValues) {
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

export const useDataValueSet = () => {
    const [{ dataSetId: ds, orgUnitId: ou, periodId: pe }] = useContextSelection()
    const isValidSelection = useIsValidSelection()

    const queryKey = dataValueSets.byIds({ ds, pe, ou })
    const activeMutations = useIsMutating({ mutationKey: queryKey })

    const result = useQuery(queryKey, {
        // Only enable this query if there are no ongoing mutations
        enabled: activeMutations === 0 && isValidSelection,
        select: (data) =>
            // It's possible for the backend to return a response that does not have dataValues
            data.dataValues
                ? mapDataValuesToFormInitialValues(data.dataValues)
                : {},
        // Only fetch whilst offline, to prevent optimistic updates from being overwritten
        networkMode: 'online',
        meta: {
            persist: true,
        },
    })

    return result
}
