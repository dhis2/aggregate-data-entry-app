import { useDataEngine } from '@dhis2/app-runtime'
import { onlineManager, QueryClient } from '@tanstack/react-query'
import {
    setDataValueMutationDefaults,
    setCompletionMutationDefaults,
    useApiError,
    handleDefaultOnSuccess,
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

// Set "custom" event-listener
// This is almost the same implementation as default in tanstack/query
// However, it is needed because default-implementation will not go online after manual onlineManager.setOnline(false) -calls
// tanstack/query source: https://github.com/TanStack/query/blob/357ec041a6fcc4a550f3df02c12ecc7bcdefbc05/packages/query-core/src/onlineManager.ts#L14
onlineManager.setEventListener((setOnline) => {
    const listener = ({ type }) => {
        const online = type === 'online'
        setOnline(online)
    }
    window.addEventListener('online', listener, false)
    window.addEventListener('offline', listener, false)
    return () => {
        window.removeEventListener('online', listener)
        window.removeEventListener('offline', listener)
    }
})

// Workaround to update header-bar online-status
// This basically just makes sure "manual" onlineManager.setOnline() results in a window-event
// that the header-bar is listening to
// TODO: might want to change this when header-bar has implemented configurable status
let prevOnline = onlineManager.isOnline()
onlineManager.subscribe(() => {
    const onlineManagerOnline = onlineManager.isOnline()
    const event = onlineManagerOnline ? 'online' : 'offline'
    // this is needed to prevent infinite loop, since onlineManager is also listening to the same events
    // which would trigger this subscription-callback infinitely
    if (prevOnline !== onlineManagerOnline) {
        prevOnline = onlineManagerOnline
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
            onSuccess: handleDefaultOnSuccess,
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
                if (
                    failureCount === 0 &&
                    error?.type === 'access' &&
                    error?.httpStatusCode === 401
                ) {
                    showSessionExpiredAlert()
                }
                if (triggerOffline) {
                    // always retry errors that trigger offlineMode
                    return true
                }
                // same as retry: 1
                return failureCount < 1
            },
            onError,
            onSuccess: handleDefaultOnSuccess,
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
