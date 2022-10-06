import { useDataEngine } from '@dhis2/app-runtime'
import { onlineManager, QueryClient } from '@tanstack/react-query'
import {
    setDataValueMutationDefaults,
    setCompletionMutationDefaults,
    useApiError,
    defaultOnSuccess,
} from '../../shared/index.js'
import createQueryFn from './create-query-fn.js'
import { useSessionExpiredAlert } from './use-session-expired-alert.js'

const logger = {
    log: console.log,
    warn: console.warn,
    error: () => {},
}

// error-types that should trigger offline-mode
const triggerOfflineErrorTypes = new Set(['network', 'access'])
const queryClient = new QueryClient({ logger })

// workaround to update header-bar online-status
// TODO: might want to change this when header-bar has implemented configurable status
let isOnline = onlineManager.isOnline()
onlineManager.subscribe(() => {
    const onlineManagerOnline = onlineManager.isOnline()
    const event = onlineManagerOnline ? 'online' : 'offline'
    // this is needed to prevent infinite loop, since onlineManager is also listening to the same events
    // which would trigger this subscription-callback infinitely
    if (isOnline !== onlineManagerOnline) {
        isOnline = onlineManagerOnline
        window.dispatchEvent(new Event(event))
    }
})

const useQueryClient = () => {
    const engine = useDataEngine()
    const queryFn = createQueryFn(engine)
    const { onError } = useApiError()

    const { show: showSessionExpiredAlert } = useSessionExpiredAlert()

    queryClient.setDefaultOptions({
        queries: {
            // Fetch once, no matter the network connectivity;
            // will be 'paused' if offline and the request fails.
            // Important to try the network when on offline/local DHIS2 implmnt'ns
            // https://react-query-alpha.tanstack.com/guides/network-mode
            networkMode: 'offlineFirst',
            queryFn,
            refetchOnWindowFocus: false,
            // Inactive queries were being garbage collected immediately unless set to Infinity
            cacheTime: Infinity,
            onSuccess: defaultOnSuccess(),
        },
        mutations: {
            networkMode: 'offlineFirst',
            retry: (failureCount, error) => {
                const triggerOffline = triggerOfflineErrorTypes.has(error?.type)
                if (triggerOffline) {
                    onlineManager.setOnline(false)
                    onlineManager.onOnline(false)
                }
                // need to handle this here, because onError will not be called when mutation is paused
                if (failureCount === 0 && error?.type === 'access') {
                    showSessionExpiredAlert()
                }
                if (triggerOffline) {
                    // always retry errors that trigger offlineMode
                    return true
                }
                // same as retry: 1
                return failureCount < 1 ? true : false
            },
            onError,
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
