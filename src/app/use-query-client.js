import { useDataEngine } from '@dhis2/app-runtime'
import { QueryClient } from 'react-query'

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
            },
        },
    })

    return queryClient
}

export default useQueryClient
