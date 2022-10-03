import { useDataEngine } from '@dhis2/app-runtime'
import { onlineManager, QueryClient } from '@tanstack/react-query'
import {
    setDataValueMutationDefaults,
    setCompletionMutationDefaults,
    useApiError,
    defaultOnSuccess,
} from '../../shared/index.js'
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
    const { onError } = useApiError()

    queryClient.setDefaultOptions({
        networkMode: 'offlineFirst',
        queries: {
            queryFn,
            refetchOnWindowFocus: false,
            // Inactive queries were being garbage collected immediately unless set to Infinity
            cacheTime: Infinity,
            // https://react-query-alpha.tanstack.com/guides/network-mode
            networkMode: 'offlineFirst',
            onSuccess: defaultOnSuccess(),
        },
        mutations: {
            retry: (_, error) => {
                // if error was a network-error, set to offline
                // if we do this in `onError`, the current mutation will not be paused!
                if (error?.type === 'network') {
                    onlineManager.setOnline(false)
                }
                return 1
            },
            onError,
            networkMode: 'offlineFirst',
            onSuccess: defaultOnSuccess(),
        },
    })
    // set mutation defaults
    // we need default mutation functions for each query-key
    // so that paused mutations can resume after a page reload
    setDataValueMutationDefaults(queryClient, engine)
    setCompletionMutationDefaults(queryClient, engine)
    return queryClient
}

export default useQueryClient
