import { useDataEngine } from '@dhis2/app-runtime'
import { useQueryClient, useMutation } from 'react-query'
import { useContextSelection } from '../../context-selection/index.js'
import { useAttributeOptionCombo } from '../use-attribute-option-combo.js'

export const DATA_VALUE_MUTATION_KEY = 'DATA_VALUE_MUTATION_KEY'

const DATA_VALUE_MUTATION = {
    resource: 'dataValues',
    type: 'create',
    data: data => data,
}

// Updates dataValue without mutating previousDataValueSet
const updateDataValue = (
    previousDataValueSet,
    updatedDataValue,
    targetIndex
) => {
    const newDataValues = [...previousDataValueSet.dataValues]
    newDataValues[targetIndex] = updatedDataValue

    return {
        ...previousDataValueSet,
        dataValues: newDataValues,
    }
}

// Adds dataValue without mutating previousDataValueSet
const addDataValue = (previousDataValueSet, newDataValue) => {
    return {
        ...previousDataValueSet,
        dataValues: [...previousDataValueSet.dataValues, newDataValue],
    }
}

export const useDataValueMutation = () => {
    const queryClient = useQueryClient()
    const [{ dataSetId, orgUnitId, periodId }] = useContextSelection()
    const attributeOptionCombo = useAttributeOptionCombo()
    const engine = useDataEngine()

    const dataValueSetQueryKey = [
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
    const mutationFn = (variables) =>
        engine.mutate(
            {
                resource: 'dataValues',
                type: 'create',
                params: ({ ...params }) => ({ ...params }),
            },
            { variables }
        )

    return useMutation(mutationFn, {
        // Used to identify whether this mutation is running
        mutationKey: DATA_VALUE_MUTATION_KEY,
        // Optimistic update of the react-query cache
        onMutate: async (newDataValue) => {
            // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
            await queryClient.cancelQueries(dataValueSetQueryKey)

            // Snapshot the previous value
            const previousDataValueSet =
                queryClient.getQueryData(dataValueSetQueryKey)

            // Optimistically update to the new value
            queryClient.setQueryData(dataValueSetQueryKey, () => {
                const matchIndex = previousDataValueSet.dataValues.findIndex(
                    (dataValue) =>
                        dataValue.categoryOptionCombo === newDataValue.co &&
                        dataValue.dataElement === newDataValue.de &&
                        dataValue.orgUnit === newDataValue.ou &&
                        dataValue.period === newDataValue.pe
                )
                const isNewValue = matchIndex === -1

                // If the field was previously empty the dataValue won't exist yet
                if (isNewValue) {
                    const formattedNewDataValue = {
                        attributeOptionCombo,
                        categoryOptionCombo: newDataValue.co,
                        dataElement: newDataValue.de,
                        orgUnit: newDataValue.ou,
                        period: newDataValue.pe,
                        value: newDataValue.value,
                    }

                    return addDataValue(
                        previousDataValueSet,
                        formattedNewDataValue
                    )
                } else {
                    const formattedNewDataValue = {
                        ...previousDataValueSet.dataValues[matchIndex],
                        value: newDataValue.value,
                    }

                    return updateDataValue(
                        previousDataValueSet,
                        formattedNewDataValue,
                        matchIndex
                    )
                }
            })

            return { previousDataValueSet, dataValueSetQueryKey }
        },
        // If the mutation fails, use the context returned from onMutate to roll back
        onError: (err, newDataValue, context) => {
            queryClient.setQueryData(
                context.dataValueSetQueryKey,
                context.previousDataValueSet
            )
        },
        retry: 1,
    })
}
