import { useDataEngine } from '@dhis2/app-runtime'
import { QueryClient } from '@tanstack/react-query'
import createQueryFn from '../app/query-client/create-query-fn.js'

const logger = {
    log: console.log,
    warn: console.warn,
    error: () => {},
}

export const useTestQueryClient = (queryClientOptions) => {
    const engine = useDataEngine()
    const queryFn = createQueryFn(engine)
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                queryFn,
                retry: false,
            },
        },
        logger,
        ...queryClientOptions,
    })

    return queryClient
}
