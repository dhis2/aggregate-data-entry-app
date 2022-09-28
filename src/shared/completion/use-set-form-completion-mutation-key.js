import { useDataValueSetQueryKey } from '../use-data-value-set/index.js'
import { mutationKeys } from './mutation-key-factory.js'

export default function useSetFormCompletionMutationKey() {
    const dataValueSetQueryKey = useDataValueSetQueryKey()
    const { params } = dataValueSetQueryKey[1]
    return mutationKeys.complete(params)
}
