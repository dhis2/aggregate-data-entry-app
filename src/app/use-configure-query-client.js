import { useDataEngine } from '@dhis2/app-runtime'
import { useQueryClient } from 'react-query'
import { createWebStoragePersistor } from 'react-query/createWebStoragePersistor-experimental'
import { persistQueryClient } from 'react-query/persistQueryClient-experimental'

// Persisted data will be garbage collected after this time
const MAX_CACHE_AGE = 1000 * 60 * 60 * 24 * 31 // One month

const useConfigureQueryClient = () => {
    const engine = useDataEngine()
    const queryClient = useQueryClient()

    // https://react-query.tanstack.com/guides/query-keys
    const queryFn = ({ queryKey }) => {
        const [query, variables] = queryKey
        return engine.query(query, { variables })
    }

    // https://react-query.tanstack.com/guides/default-query-function
    queryClient.setDefaultOptions({
        queries: {
            queryFn,
            refetchOnWindowFocus: false,
            // Needs to be equal or higher than the persisted cache maxAge
            cacheTime: MAX_CACHE_AGE,
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
            shouldDehydrateQuery: (query) => {
                return query.state.status === 'success'
            },
            shouldDehydrateMutation: (mutation) => {
                return mutation.state.isPaused
            },
            dehydrateMutations: true,
            dehydrateQueries: true,
        },
    })
}

export default useConfigureQueryClient
