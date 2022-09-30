import { useQueryClient } from '@tanstack/react-query'
import { useDataValueSetQueryKey } from '../use-data-value-set/index.js'
import useSetFormCompletionMutationKey from './use-set-form-completion-mutation-key.js'

export default function useImperativeCancelCompletionMutation() {
    const queryClient = useQueryClient()
    const mutationCache = queryClient.getMutationCache()
    const mutationKey = useSetFormCompletionMutationKey()
    const dataValueSetQueryKey = useDataValueSetQueryKey()

    return () => {
        const foundMutation = mutationCache.find({ mutationKey })

        if (!foundMutation) {
            return
        }

        // remove the mutation itself
        mutationCache.remove(foundMutation)

        // undo the optimistic update
        // @TODO: Why does this cause a request to the data values that will
        //   end up with a 404 due to being offline while the `onMutate`
        //   callback in the `useSetFormCompletionMutation` does not?
        const { completed } = foundMutation.options.variables

        queryClient.setQueryData(
            dataValueSetQueryKey,
            (previousDataValueSet) => ({
                ...previousDataValueSet,
                completeStatus: {
                    ...previousDataValueSet.completeStatus,
                    complete: !completed,
                },
            })
        )
    }
}
