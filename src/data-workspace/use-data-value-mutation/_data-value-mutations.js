import { useQueryClient, useMutation } from 'react-query'
import { useDataValueSetQueryKey } from '../../shared/index.js'
import {
    useDeleteDataValueMutationFunction,
    useSetDataValueCommentMutationFunction,
    useSetDataValueMutationFunction,
    useUploadFileDataValueMutationFunction,
} from './_mutation-functions.js'
import { useDataValueParams } from './_use-data-value-params.js'
import useApiError from './use-api-error.js'

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
        // todo: maybe make this reusable
        mutationKey: ['dataValues', { params: dataValueParams }],

        onMutate: async (newDataValueData) => {
            // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
            await queryClient.cancelQueries(dataValueSetQueryKey)

            // Snapshot the previous value
            const previousDataValueSet =
                queryClient.getQueryData(dataValueSetQueryKey)

            // `onMutate` is expected to be an optimistic update function
            await optimisticUpdateFn({
                queryClient,
                newDataValueData,
                dataValueSetQueryKey,
            })

            // This return value becomes the `context` variable in
            // onError (and onSettled) handlers
            return { previousDataValueSet, dataValueSetQueryKey }
        },

        // If the mutation fails, use the context returned from onMutate to roll back
        onError: (err, newDataValue, context) => {
            handleMutationError(err)
            queryClient.setQueryData(
                context.dataValueSetQueryKey,
                context.previousDataValueSet
            )
        },

        // Can be used optionally
        // todo -- or require this in mutate() invocation
        onSuccess,
    })
}

export function useSetDataValueMutation({ deId, cocId }) {
    const dataValueParams = useDataValueParams({ deId, cocId })
    const mutationFn = useSetDataValueMutationFunction(dataValueParams)

    return useSharedDataValueMutation({
        dataValueParams,
        mutationFn,
        // todo: optimistically update cache
        optimisticUpdateFn: () => 'todo',
    })
}
export function useSetDataValueCommentMutation({ deId, cocId }) {
    const dataValueParams = useDataValueParams({ deId, cocId })
    const mutationFn = useSetDataValueCommentMutationFunction(dataValueParams)

    return useSharedDataValueMutation({
        dataValueParams,
        mutationFn,
        // todo: optimistically update cache
        optimisticUpdateFn: () => 'todo',
    })
}
export function useUploadFileDataValueMutation({ deId, cocId }) {
    const dataValueParams = useDataValueParams({ deId, cocId })
    const mutationFn = useUploadFileDataValueMutationFunction(dataValueParams)

    return useSharedDataValueMutation({
        dataValueParams,
        mutationFn,
        // todo: optimistically update cache
        optimisticUpdateFn: () => 'todo',
    })
}
export function useDeleteDataValueMutation({ deId, cocId }) {
    const dataValueParams = useDataValueParams({ deId, cocId })
    const mutationFn = useDeleteDataValueMutationFunction(dataValueParams)

    return useSharedDataValueMutation({
        dataValueParams,
        mutationFn,
        // todo: optimistically update cache
        optimisticUpdateFn: () => 'todo',
    })
}
