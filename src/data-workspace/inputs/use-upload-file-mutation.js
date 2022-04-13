import { useDataEngine } from '@dhis2/app-runtime'
import { useQueryClient, useMutation } from 'react-query'
import { useContextSelection } from '../../context-selection/index.js'
import { dataValueSets } from '../query-key-factory.js'
import { useAttributeOptionCombo } from '../use-attribute-option-combo.js'
import { updateDataValue, addDataValue } from './pure-data-value-helpers.js'

export const useUploadFileMutation = () => {
    const queryClient = useQueryClient()
    const [{ dataSetId, orgUnitId, periodId }] = useContextSelection()
    const attributeOptionCombo = useAttributeOptionCombo()
    const engine = useDataEngine()
    const mutationFn = (variables) =>
        engine.mutate(
            {
                resource: 'dataValues/file',
                type: 'create',
                data: (data) => data,
            },
            { variables }
        )

    const dataValueSetQueryKey = dataValueSets.byIds({
        dataSetId,
        periodId,
        orgUnitId,
        attributeOptionCombo,
    })

    return useMutation(mutationFn, {
        // Used to identify whether this mutation is running
        mutationKey: dataValueSetQueryKey,
        // Optimistic update of the react-query cache
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

                const isNewDataValue = matchIndex === -1
                // If this is a file-type data value, set value to some file metadata
                // so it's available offline. When DVSets is refetched, the value will
                // be replaced by a UID that will be handled in the FileResourceInput components
                const newValue = {
                    name: newDataValue.file?.name,
                    size: newDataValue.file?.size,
                }

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
