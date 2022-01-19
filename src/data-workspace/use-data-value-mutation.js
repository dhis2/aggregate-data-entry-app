import { useDataEngine } from '@dhis2/app-runtime'
import { useQueryClient, useMutation } from 'react-query'
import { useContextSelection } from '../context-selection/index.js'
import { dataValueQuery, useAttributeOptionCombo } from './data-workspace.js'

const DATA_VALUE_MUTATION = {
    resource: 'dataValues',
    type: 'create',
    params: ({ ...params }) => ({ ...params }),
}

// Updates dataValue without mutating previousDataValues
const updateDataValue = (previousDataValues, updatedDataValue, targetIndex) => {
    const newDataValues = [...previousDataValues.dataValues.dataValues]
    newDataValues[targetIndex] = updatedDataValue

    return {
        ...previousDataValues,
        dataValues: {
            ...previousDataValues.dataValues,
            dataValues: newDataValues,
        },
    }
}

// Adds dataValue without mutating previousDataValues
const addDataValue = (previousDataValues, newDataValue) => {
    return {
        ...previousDataValues,
        dataValues: {
            ...previousDataValues.dataValues,
            dataValues: [
                ...previousDataValues.dataValues.dataValues,
                newDataValue,
            ],
        },
    }
}

export const useDataValueMutation = () => {
    const queryClient = useQueryClient()
    const [{ dataSetId, orgUnitId, periodId }] = useContextSelection()
    const attributeOptionComboId = useAttributeOptionCombo()
    const engine = useDataEngine()

    const dataValueQueryKey = [
        dataValueQuery,
        {
            dataSetId,
            periodId,
            orgUnitId,
            attributeOptionComboId,
        },
    ]
    const mutationFn = (variables) =>
        engine.mutate(DATA_VALUE_MUTATION, { variables })

    return useMutation(mutationFn, {
        // Optimistic update of the react-query cache
        onMutate: async (newDataValue) => {
            // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
            await queryClient.cancelQueries(dataValueQueryKey)

            // Snapshot the previous value
            const previousDataValues =
                queryClient.getQueryData(dataValueQueryKey)

            // Optimistically update to the new value
            queryClient.setQueryData(dataValueQueryKey, () => {
                const matchIndex =
                    previousDataValues.dataValues.dataValues.findIndex(
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
                        attributeOptionCombo: attributeOptionComboId,
                        categoryOptionCombo: newDataValue.co,
                        dataElement: newDataValue.de,
                        orgUnit: newDataValue.ou,
                        period: newDataValue.pe,
                        value: newDataValue.value,
                    }

                    return addDataValue(
                        previousDataValues,
                        formattedNewDataValue
                    )
                } else {
                    const formattedNewDataValue = {
                        ...previousDataValues.dataValues.dataValues[matchIndex],
                        value: newDataValue.value,
                    }

                    return updateDataValue(
                        previousDataValues,
                        formattedNewDataValue,
                        matchIndex
                    )
                }
            })

            return { previousDataValues, dataValueQueryKey }
        },
        // If the mutation fails, use the context returned from onMutate to roll back
        onError: (err, newDataValue, context) => {
            queryClient.setQueryData(
                context.dataValueQueryKey,
                context.previousDataValues
            )
        },
        // Always refetch after error or success
        // eslint-disable-next-line max-params
        onSettled: (newDataValue, error, variables, context) => {
            queryClient.invalidateQueries(context.dataValueQueryKey)
        },
        retry: 1,
    })
}
