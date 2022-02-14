import { useQuery, useIsMutating } from 'react-query'
import { useContextSelection } from '../context-selection/index.js'
import { DATA_VALUE_MUTATION_KEY } from './data-entry-cell/index.js'
import { useAttributeOptionCombo } from './use-attribute-option-combo.js'

// Form value object structure: { [dataElementId]: { [cocId]: value } }
function mapDataValuesToFormInitialValues(dataValues) {
    const formInitialValues = dataValues.reduce(
        (acc, { dataElement, categoryOptionCombo, value }) => {
            if (!acc[dataElement]) {
                acc[dataElement] = { [categoryOptionCombo]: value }
            } else {
                acc[dataElement][categoryOptionCombo] = value
            }
            return acc
        },
        {}
    )
    return formInitialValues
}

export const useInitialDataValues = () => {
    const [{ dataSetId, orgUnitId, periodId }] = useContextSelection()
    const attributeOptionCombo = useAttributeOptionCombo()
    const activeMutations = useIsMutating({
        mutationKey: DATA_VALUE_MUTATION_KEY,
    })
    const queryKey = [
        'dataValueSets',
        {
            params: {
                dataSet: dataSetId,
                period: periodId,
                orgUnit: orgUnitId,
                attributeOptionCombo,
            },
        },
    ]
    const hasParameters =
        !!dataSetId && !!orgUnitId && !!periodId && !!attributeOptionCombo

    return useQuery(queryKey, {
        // Only enable this query if there are no ongoing mutations
        enabled: activeMutations === 0 && hasParameters,
        select: (data) =>
            // It's possible for the backend to return a response that does not have dataValues
            data.dataValues
                ? mapDataValuesToFormInitialValues(data.dataValues)
                : {},
    })
}
