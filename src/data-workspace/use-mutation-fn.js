import { useDataEngine } from '@dhis2/app-runtime'

export const useMutationFn = (mutation) => {
    const engine = useDataEngine()

    return (variables) => engine.mutate(mutation, { variables })
}
