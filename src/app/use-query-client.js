import { useDataEngine } from '@dhis2/app-runtime'
import { QueryClient } from 'react-query'
import { createWebStoragePersistor } from 'react-query/createWebStoragePersistor-experimental'
import { persistQueryClient } from 'react-query/persistQueryClient-experimental'

// Persisted data will garbage collected after this time
const MAX_CACHE_AGE = Infinity

const useQueryClient = () => {
    const engine = useDataEngine()

    // https://react-query.tanstack.com/guides/query-keys
    const queryFn = ({ queryKey }) => {
        const [query, variables] = queryKey
        return engine.query(query, { variables })
    }

    // https://react-query.tanstack.com/guides/default-query-function
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                queryFn,
                refetchOnWindowFocus: false,
                // Needs to be equal or higher than the persisted cache maxAge
                cacheTime: MAX_CACHE_AGE,
            },
        },
    })

    const localStoragePersistor = createWebStoragePersistor({
        storage: window.localStorage,
    })

    persistQueryClient({
        queryClient,
        persistor: localStoragePersistor,
        maxAge: MAX_CACHE_AGE,
        dehydrateOptions: {
            dehydrateMutations: true,
            dehydrateQueries: true,
        },
    })

    return queryClient
}

export default useQueryClient
