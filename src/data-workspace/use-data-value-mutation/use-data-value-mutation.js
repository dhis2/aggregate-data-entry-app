import { useQueryClient, useMutation } from 'react-query'
import { useDataValueSetQueryKey } from '../../shared/index.js'
import useApiError from './use-api-error.js'

export default function useDataValueMutation({
    mutationFn,
    onMutate,
    onSuccess,
}) {
    const queryClient = useQueryClient()
    const dataValueSetQueryKey = useDataValueSetQueryKey()
    const { onError: handleMutationError } = useApiError()

    return useMutation(mutationFn, {
        // optionally hooks can use this
        onSuccess,

        retry: 1,

        // Used to identify whether this mutation is running
        mutationKey: dataValueSetQueryKey,

        // Optimistic update of the react-query cache
        onMutate: (newDataValue) =>
            onMutate({
                queryClient,
                newDataValue,
                dataValueSetQueryKey,
            }),

        // If the mutation fails, use the context returned from onMutate to roll back
        onError: (err, newDataValue, context) => {
            handleMutationError(err)
            queryClient.setQueryData(
                context.dataValueSetQueryKey,
                context.previousDataValueSet
            )
        },
    })
}
