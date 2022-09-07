import { useDataEngine } from '@dhis2/app-runtime'
import { QueryClient } from '@tanstack/react-query'
import { useSetDataValueMutationDefaults } from '../../data-workspace/data-value-mutations/index.js'
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

    // set mutation defaults
    // we need mutation functions for each query-key
    // so that paused mutations can resume after a page reload
    useSetDataValueMutationDefaults(queryClient)

    return queryClient
}

export default useQueryClient
