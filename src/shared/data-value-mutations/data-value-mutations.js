import { useQueryClient, useMutation } from '@tanstack/react-query'
import {
    ApiMutationError,
    isFetchError,
    useApiError,
    shouldRollbackError,
} from '../api-errors/index.js'
import { defaultOnSuccess } from '../default-on-success.js'
import { useSyncErrorsStore } from '../stores/sync-errors-store.js'
import { useDataValueSetQueryKey } from '../use-data-value-set/index.js'
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
import { mutationKeys } from './mutation-key-factory.js'
import { useDataValueParams } from './use-data-value-params.js'

function useSharedDataValueMutation({
    mutationKey,
    dataValueParams,
    mutationFn,
    optimisticUpdateFn,
    options: { onSuccess, onError } = {},
}) {
    const queryClient = useQueryClient()
    const dataValueSetQueryKey = useDataValueSetQueryKey()

    const { onError: handleMutationError } = useApiError()
    const clearError = useSyncErrorsStore(
        (state) => state.clearErrorByMutationKey
    )

    return useMutation(mutationFn, {
        mutationKey: mutationKey,
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
            return { previousQueryData, mutationKey }
        },

        // If the mutation fails, use the context returned from onMutate to roll back
        onError: (err, newDataValue, context) => {
            // this should always be the case, unless a SyntaxError occurs?
            onError?.()
            if (isFetchError(err)) {
                err = new ApiMutationError(
                    err,
                    context.mutationKey,
                    newDataValue
                )
            }
            handleMutationError(err)
            const { shouldRollback } = shouldRollbackError(err)

            if (shouldRollback) {
                queryClient.setQueryData(
                    dataValueSetQueryKey,
                    context.previousQueryData
                )
            }
        },
        onSuccess: defaultOnSuccess((data, value, { mutationKey }) => {
            clearError(mutationKey)
            onSuccess?.()
        }),
    })
}

/**
 * The `mutate` function returned by this hook expects a `variables` argument
 * that looks like `{ value: Number | String }` or `{ comment: String }`
 * or `{ followUp: boolean }`.
 * This and the following mutations handle the rest of the data value params
 * and merge in the `variables` object.
 */
export function useSetDataValueMutation({ deId, cocId }, options) {
    const dataValueParams = useDataValueParams({ deId, cocId })
    const mutationFn = useSetDataValueMutationFunction()

    return useSharedDataValueMutation({
        dataValueParams,
        mutationKey: mutationKeys.update(dataValueParams),
        mutationFn,
        optimisticUpdateFn: optimisticallySetDataValue,
        options,
    })
}
/**
 * The `mutate` function returned by this hook expects a `variables` argument
 * that looks like `{ file: File }`
 */
export function useUploadFileDataValueMutation({ deId, cocId }) {
    const dataValueParams = useDataValueParams({ deId, cocId })
    const mutationFn = useUploadFileDataValueMutationFunction()

    return useSharedDataValueMutation({
        mutationKey: mutationKeys.file(dataValueParams),
        dataValueParams,
        mutationFn,
        optimisticUpdateFn: optimisticallySetFileDataValue,
    })
}
/** The `mutate` function returned by this hook expects no arguments */
export function useDeleteDataValueMutation({ deId, cocId }) {
    const dataValueParams = useDataValueParams({ deId, cocId })
    const mutationFn = useDeleteDataValueMutationFunction()

    return useSharedDataValueMutation({
        mutationKey: mutationKeys.delete(dataValueParams),
        dataValueParams,
        mutationFn,
        optimisticUpdateFn: optimisticallyDeleteDataValue,
    })
}
