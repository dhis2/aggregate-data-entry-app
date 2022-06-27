import { useQueryClient, useMutation } from 'react-query'
import useDataValueSetQueryKey from '../use-data-value-set-query-key.js'

export default function useDataValueMutation({ mutationFn, onMutate }) {
    const queryClient = useQueryClient()
    const dataValueSetQueryKey = useDataValueSetQueryKey()

    return useMutation(mutationFn, {
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
            queryClient.setQueryData(
                context.dataValueSetQueryKey,
                context.previousDataValueSet
            )
        },
    })
}
