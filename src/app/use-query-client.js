import { useDataEngine } from '@dhis2/app-runtime'
import { QueryClient } from 'react-query'
import { persistQueryClient } from 'react-query/persistQueryClient'
import createIDBPersister from './persister.js'

// Persisted data will be garbage collected after this time
const MAX_CACHE_AGE = 1000 * 60 * 60 * 24 * 31 // One month

const useQueryClient = () => {
    const engine = useDataEngine()

    // https://react-query.tanstack.com/guides/query-keys
    const queryFn = ({ queryKey }) => {
        const [resource, { params, id }] = queryKey
        const appRuntimeQuery = {
            [resource]: {
                resource,
                id,
                params,
            },
        }

        return engine.query(appRuntimeQuery).then((data) => data[resource])
    }

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

    const persister = createIDBPersister()

    persistQueryClient({
        queryClient,
        persister,
        maxAge: MAX_CACHE_AGE,
        dehydrateOptions: {
            dehydrateMutations: true,
            dehydrateQueries: true,
        },
    })

    return queryClient
}

export default useQueryClient
