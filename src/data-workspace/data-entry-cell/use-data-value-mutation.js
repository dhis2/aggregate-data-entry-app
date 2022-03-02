import { useDataEngine } from '@dhis2/app-runtime'
import { useQueryClient, useMutation } from 'react-query'
import { useContextSelection } from '../../context-selection/index.js'
import { useAttributeOptionCombo } from '../use-attribute-option-combo.js'

export const DATA_VALUE_MUTATION_KEY = 'DATA_VALUE_MUTATION_KEY'

const DATA_VALUE_MUTATION = {
    resource: 'dataValues',
    type: 'create',
    data: (data) => data,
}
const UPLOAD_FILE_MUTATION = {
    resource: 'dataValues/file',
    type: 'create',
    data: (data) => data,
}
// This needs to be used for file-type data values; sending an empty 'value' prop
// doesn't work to clear the file (todo: replace when backend changes)
const DELETE_VALUE_MUTATION = {
    resource: 'dataValues',
    type: 'delete',
    params: (params) => params,
}

export const MUTATION_TYPES = {
    DEFAULT: 'DEFAULT',
    FILE_UPLOAD: 'FILE_UPLOAD',
    DELETE: 'DELETE',
}
const mutationsByType = {
    DEFAULT: DATA_VALUE_MUTATION,
    FILE_UPLOAD: UPLOAD_FILE_MUTATION,
    DELETE: DELETE_VALUE_MUTATION,
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
        // dataValueSet.dataValues can be undefined
        dataValues: previousDataValueSet.dataValues
            ? [...previousDataValueSet.dataValues, newDataValue]
            : [newDataValue],
    }
}

// Delete dataValue without mutating previousDataValueSet
const deleteDataValue = (previousDataValueSet, matchIndex) => {
    const previousDataValues = previousDataValueSet.dataValues
    const newDataValues = [
        ...previousDataValues.slice(0, matchIndex),
        ...previousDataValues.slice(matchIndex + 1),
    ]
    return {
        ...previousDataValueSet,
        dataValues: newDataValues,
    }
}

export const useDataValueMutation = (mutationType = MUTATION_TYPES.DEFAULT) => {
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
    // Use mutation appropriate to mutation type
    const mutationFn = (variables) =>
        engine.mutate(mutationsByType[mutationType], { variables })

    return useMutation(mutationFn, {
        // Used to identify whether this mutation is running
        mutationKey: DATA_VALUE_MUTATION_KEY,
        // Optimistic update of the react-query cache
        // Mutation args correspond to new data value
        onMutate: async (newDataValue) => {
            // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
            await queryClient.cancelQueries(dataValueSetQueryKey)

            // Snapshot the previous value
            const previousDataValueSet =
                queryClient.getQueryData(dataValueSetQueryKey)

            // Optimistically update to the new value
            queryClient.setQueryData(dataValueSetQueryKey, () => {
                // dataValueSet.dataValues can be undefined
                const previousDataValues = previousDataValueSet.dataValues || []
                const matchIndex = previousDataValues.findIndex(
                    (dataValue) =>
                        dataValue.categoryOptionCombo === newDataValue.co &&
                        dataValue.dataElement === newDataValue.de &&
                        dataValue.orgUnit === newDataValue.ou &&
                        dataValue.period === newDataValue.pe
                )

                if (mutationType === MUTATION_TYPES.DELETE) {
                    return deleteDataValue(previousDataValueSet, matchIndex)
                }

                const isNewDataValue = matchIndex === -1
                // If this is a file-type data value, set value to some file metadata
                // so it's available offline. When DVSets is refetched, the value will
                // be replaced by a UID that will be handled in the FileResourceInput components
                const newValue =
                    mutationType === MUTATION_TYPES.FILE_UPLOAD
                        ? {
                              name: newDataValue.file?.name,
                              size: newDataValue.file?.size,
                          }
                        : newDataValue.value

                // If the field was previously empty the dataValue won't exist yet
                if (isNewDataValue) {
                    const formattedNewDataValue = {
                        attributeOptionCombo,
                        categoryOptionCombo: newDataValue.co,
                        dataElement: newDataValue.de,
                        orgUnit: newDataValue.ou,
                        period: newDataValue.pe,
                        value: newValue,
                    }

                    return addDataValue(
                        previousDataValueSet,
                        formattedNewDataValue
                    )
                } else {
                    const formattedNewDataValue = {
                        ...previousDataValues[matchIndex],
                        value: newValue,
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
