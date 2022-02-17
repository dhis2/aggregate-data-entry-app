import { useDataEngine } from '@dhis2/app-runtime'
import { QueryClient } from 'react-query'
import { persistQueryClient } from 'react-query/persistQueryClient'
import createIDBPersister from './persister.js'

const queryClient = new QueryClient()

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

    const persister = createIDBPersister()

    persistQueryClient({
        queryClient,
        persister,
        maxAge: Infinity,
        dehydrateOptions: {
            dehydrateMutations: true,
            dehydrateQueries: true,
            shouldDehydrateQuery: (query) => {
                const isSuccess = query.state.status === 'success'
                const isOfflineFirst = query.options.networkMode === 'offlineFirst'

                return isSuccess && !isOfflineFirst
            },
        },
    })

    return queryClient
}

export default useQueryClient
