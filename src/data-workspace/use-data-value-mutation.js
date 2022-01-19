import { useDataEngine } from '@dhis2/app-runtime'
import { useQueryClient, useMutation } from 'react-query'
import { useContextSelection } from '../context-selection/index.js'
import { dataValueQuery, useAttributeOptionCombo } from './data-workspace.js'

const DATA_VALUE_MUTATION = {
    resource: 'dataValues',
    type: 'create',
    params: ({ ...params }) => ({ ...params }),
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
                const newDataValues =
                    previousDataValues.dataValues.dataValues.map(
                        (dataValue) => {
                            const {
                                categoryOptionCombo,
                                dataElement,
                                orgUnit,
                                period,
                            } = dataValue
                            const { co, de, ou, pe, value } = newDataValue
                            const match =
                                categoryOptionCombo === co &&
                                dataElement === de &&
                                orgUnit === ou &&
                                period === pe

                            if (!match) {
                                return dataValue
                            }

                            return {
                                ...dataValue,
                                value,
                            }
                        }
                    )

                // Ensure we don't mutate previousDataValues
                return {
                    ...previousDataValues,
                    dataValues: {
                        ...previousDataValues.dataValues,
                        dataValues: newDataValues,
                    },
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
