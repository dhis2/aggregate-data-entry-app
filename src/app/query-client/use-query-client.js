import { useDataEngine } from '@dhis2/app-runtime'
import { QueryClient } from '@tanstack/react-query'
import createQueryFn from './create-query-fn.js'

const logger = {
    log: console.log,
    warn: console.warn,
    error: () => {},
}

const queryClient = new QueryClient({ logger })

const useQueryClient = () => {
    const engine = useDataEngine()
    const queryFn = createQueryFn(engine)

    queryClient.setDefaultOptions({
        queries: {
            queryFn,
            refetchOnWindowFocus: false,
            // Inactive queries were being garbage collected immediately unless set to Infinity
            cacheTime: Infinity,
            // https://react-query-alpha.tanstack.com/guides/network-mode
            networkMode: 'offlineFirst',
        },
    })

    const mutationCache = queryClient.getMutationCache()
    // prevent duplicate mutations from being stored in cache
    mutationCache.subscribe((event) => {
        if (event.type !== 'updated') {
            return
        }
        const { mutation } = event
        const duplicateMutation = mutationCache.find({
            mutationKey: mutation.options.mutationKey,
            // ensure previous mutation was fired before this
            // (mutationId is an incremental integer)
            predicate: (currMutation) =>
                currMutation.mutationId < mutation.mutationId,
        })
        if (duplicateMutation) {
            mutationCache.remove(duplicateMutation)
        }
    })

    return queryClient
}

export default useQueryClient
