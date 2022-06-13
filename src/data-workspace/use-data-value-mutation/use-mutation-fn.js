import { useDataEngine } from '@dhis2/app-runtime'
import { useCallback } from 'react'

export default function useMutationFn(mutationQuery) {
    const engine = useDataEngine()

    return useCallback(
        (variables) => engine.mutate(mutationQuery, { variables }),
        [engine, mutationQuery]
    )
}
