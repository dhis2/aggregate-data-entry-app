import { useQueryClient, useMutation } from 'react-query'
import { useContextSelection } from '../../context-selection/index.js'
import { dataValueSets } from '../query-key-factory.js'

export default function useDataValueMutation({ mutationFn, onMutate }) {
    const queryClient = useQueryClient()
    const [{ dataSetId: ds, orgUnitId: ou, periodId: pe }] =
        useContextSelection()
    const dataValueSetQueryKey = dataValueSets.byIds({ ds, pe, ou })

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
