import { useAlert, useDataEngine } from '@dhis2/app-runtime'
import { useQueryClient, useMutation } from '@tanstack/react-query'
import {
    defaultOnSuccess,
    useDataValueSetQueryKey,
} from '../../shared/index.js'
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
        de: dataElement,
        ou: orgUnit,
        co: categoryOptionCombo,
    }),
}

export default function useDeleteLimits(onDone) {
    // These are needed for the optimistic delete
    const queryClient = useQueryClient()
    const dataValueSetQueryKey = useDataValueSetQueryKey()
    const engine = useDataEngine()

    const { show: showErrorAlert } = useAlert((message) => message, {
        critical: true,
    })

    const mutationFn = ({ dataElement, orgUnit, categoryOptionCombo }) => {
        const variables = { dataElement, orgUnit, categoryOptionCombo }
        return engine.mutate(MUTATION_DELETE_MIN_MAX_LIMITS, { variables })
    }

    return useMutation(mutationFn, {
        // Used to identify whether this mutation is running
        mutationKey: dataValueSetQueryKey,

        // Used so the limits UI can switch from form to value display
        onSuccess: defaultOnSuccess(onDone),

        onMutate: async (variables) => {
            // Cancel any outgoing refetches (so they don't overwrite our optimistic delete)
            await queryClient.cancelQueries(dataValueSetQueryKey)

            // Snapshot the previous value
            const previousDataValueSet =
                queryClient.getQueryData(dataValueSetQueryKey) || {}

            // Optimistically delete to the new value
            queryClient.setQueryData(dataValueSetQueryKey, () => {
                const previousMinMaxValues =
                    previousDataValueSet.minMaxValues || []

                const matchIndex = getMinMaxValueIndex(
                    previousMinMaxValues,
                    variables
                )

                return deleteLimit(previousDataValueSet, variables, matchIndex)
            })

            return { previousDataValueSet, dataValueSetQueryKey }
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
