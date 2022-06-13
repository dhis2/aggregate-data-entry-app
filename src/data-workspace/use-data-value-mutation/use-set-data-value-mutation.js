import { useApiAttributeParams } from '../../shared/index.js'
import optimisticallySetDataValue from './optimistically-set-data-value.js'
import useDataValueMutation from './use-data-value-mutation.js'
import useMutationFn from './use-mutation-fn.js'

export const SET_DATA_VALUE_MUTATION = {
    resource: 'dataValues',
    type: 'create',
    data: (data) => data,
}

export function useSetDataValueMutation() {
    const { attributeCombo, attributeOptions } = useApiAttributeParams()
    const mutationFn = useMutationFn(SET_DATA_VALUE_MUTATION)

    return useDataValueMutation({
        mutationFn,
        onMutate: ({ queryClient, newDataValue, dataValueSetQueryKey }) =>
            optimisticallySetDataValue({
                queryClient,
                newDataValue,
                dataValueSetQueryKey,
                attributeCombo,
                attributeOptions,
            }),
    })
}
