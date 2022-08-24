import { useQueryClient, useMutation } from 'react-query'
import { useDataValueSetQueryKey } from '../../shared/index.js'
import {
    optimisticallyDeleteDataValue,
    optimisticallySetDataValue,
    optimisticallySetFileDataValue,
} from './data-value-optimistic-updates.js'
import {
    useDeleteDataValueMutationFunction,
    useSetDataValueMutationFunction,
    useUploadFileDataValueMutationFunction,
} from './mutation-functions.js'
import useApiError from './use-api-error.js'
import { useDataValueParams } from './use-data-value-params.js'

export function getDataValueMutationKey(dataValueParams) {
    return ['dataValues', { params: dataValueParams }]
}

function useSharedDataValueMutation({
    dataValueParams,
    mutationFn,
    optimisticUpdateFn,
    onSuccess,
}) {
    const queryClient = useQueryClient()
    const dataValueSetQueryKey = useDataValueSetQueryKey()
    const { onError: handleMutationError } = useApiError()

    return useMutation(mutationFn, {
        retry: 1,
        mutationKey: getDataValueMutationKey(dataValueParams),

        onMutate: async (variables) => {
            // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
            await queryClient.cancelQueries(dataValueSetQueryKey)

            // Snapshot the previous value
            // (Can be undefined when offline, in which case create a dummy response)
            const previousQueryData = queryClient.getQueryData(
                dataValueSetQueryKey
            ) ?? { dataValues: [], minMaxValues: [] }

            // Optimistically update the RQ cache
            optimisticUpdateFn({
                variables,
                dataValueMutationParams: dataValueParams,
                queryClient,
                dataValueSetQueryKey,
            })

            // This return value becomes the `context` variable in
            // onError (and onSettled) handlers
            return { previousQueryData }
        },

        // If the mutation fails, use the context returned from onMutate to roll back
        onError: (err, newDataValue, context) => {
            handleMutationError(err)
            queryClient.setQueryData(
                dataValueSetQueryKey,
                context.previousQueryData
            )
        },

        // Can be used optionally
        // todo -- or require this in mutate() invocation
        onSuccess,
    })
}

/**
 * The `mutate` function returned by this hook expects a `variables` argument
 * that looks like `{ value: Number | String }` or `{ comment: String }`
 * or `{ followUp: boolean }`.
 * This and the following mutations handle the rest of the data value params
 * and merge in the `variables` object.
 */
export function useSetDataValueMutation({ deId, cocId }) {
    const dataValueParams = useDataValueParams({ deId, cocId })
    const mutationFn = useSetDataValueMutationFunction(dataValueParams)

    return useSharedDataValueMutation({
        dataValueParams,
        mutationFn,
        optimisticUpdateFn: optimisticallySetDataValue,
    })
}
/**
 * The `mutate` function returned by this hook expects a `variables` argument
 * that looks like `{ file: File }`
 */
export function useUploadFileDataValueMutation({ deId, cocId }) {
    const dataValueParams = useDataValueParams({ deId, cocId })
    const mutationFn = useUploadFileDataValueMutationFunction(dataValueParams)

    return useSharedDataValueMutation({
        dataValueParams,
        mutationFn,
        optimisticUpdateFn: optimisticallySetFileDataValue,
    })
}
/** The `mutate` function returned by this hook expects no arguments */
export function useDeleteDataValueMutation({ deId, cocId }) {
    const dataValueParams = useDataValueParams({ deId, cocId })
    const mutationFn = useDeleteDataValueMutationFunction(dataValueParams)

    return useSharedDataValueMutation({
        dataValueParams,
        mutationFn,
        optimisticUpdateFn: optimisticallyDeleteDataValue,
    })
}
