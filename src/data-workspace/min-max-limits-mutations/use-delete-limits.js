import { useAlert, useDataEngine } from '@dhis2/app-runtime'
import { useQueryClient, useMutation } from '@tanstack/react-query'
import {
    useContextSelection,
    useApiAttributeParams,
} from '../../shared/index.js'
import { dataValueSets } from '../query-key-factory.js'
import getMinMaxValueIndex from './get-min-max-value-index.js'

function deleteLimit(previousDataValueSet, deletedLimit, targetIndex) {
    const newLimits = [
        ...previousDataValueSet.minMaxValues.slice(0, targetIndex),
        ...previousDataValueSet.minMaxValues.slice(targetIndex + 1),
    ]

    return {
        ...previousDataValueSet,
        minMaxValues: newLimits,
    }
}

const MUTATION_DELETE_MIN_MAX_LIMITS = {
    resource: 'dataEntry/minMaxValues',
    type: 'delete',
    params: ({ dataElement, orgUnit, categoryOptionCombo }) => ({
        dataElement,
        orgUnit,
        categoryOptionCombo,
    }),
}

export default function useDeleteLimits(onDone) {
    // These are needed for the optimistic delete
    const queryClient = useQueryClient()
    const [{ dataSetId, orgUnitId, periodId }] = useContextSelection()
    const {
        attributeCombo: categoryComboId,
        attributeOptions: categoryOptionIds,
    } = useApiAttributeParams()

    const dataValueSetQueryKey = dataValueSets.byIds({
        dataSetId,
        periodId,
        orgUnitId,
        categoryComboId,
        categoryOptionIds,
    })

    const engine = useDataEngine()
    const showErrorAlert = useAlert((message) => message, { critical: true })

    const mutationFn = ({
        dataElement,
        orgUnit,
        categoryOptionCombo,
        minValue,
        maxValue,
    }) => {
        const variables = {
            dataElement,
            orgUnit,
            categoryOptionCombo,
            minValue,
            maxValue,
        }

        return engine.mutate(MUTATION_DELETE_MIN_MAX_LIMITS, { variables })
    }

    return useMutation(mutationFn, {
        retry: 1,

        // Used to identify whether this mutation is running
        mutationKey: dataValueSetQueryKey,

        // Used so the limits UI can switch from form to value display
        onSuccess: onDone,

        onMutate: async (variables) => {
            // Cancel any outgoing refetches (so they don't overwrite our optimistic delete)
            await queryClient.cancelQueries(dataValueSetQueryKey)

            // Snapshot the previous value
            const previousDataValueSet =
                queryClient.getQueryData(dataValueSetQueryKey)

            // Optimistically delete to the new value
            queryClient.setQueryData(dataValueSetQueryKey, () => {
                // dataValueSet.minMaxValues can be undefined
                const previousMinMaxValues =
                    previousDataValueSet.minMaxValues || []
                const matchIndex = getMinMaxValueIndex(
                    previousMinMaxValues,
                    variables
                )

                return deleteLimit(previousDataValueSet, variables, matchIndex)
            })

            const context = { previousDataValueSet, dataValueSetQueryKey }
            return context
        },
        onError: (event, _, context) => {
            showErrorAlert(
                `Something went wrong while deleting the min-max limits: ${event.message}`
            )

            queryClient.setQueryData(
                context.dataValueSetQueryKey,
                context.previousDataValueSet
            )
        },
    })
}
