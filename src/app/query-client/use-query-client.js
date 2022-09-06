import { useDataEngine } from '@dhis2/app-runtime'
import { QueryClient } from '@tanstack/react-query'
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

    queryClient.setMutationDefaults(['dataValues'], {
        mutationFn: async function (variables) {
            const { mutationKey } = this
            const { params } = mutationKey[1]

            await queryClient.cancelQueries(mutationKey)
            const mutationObj = {
                resource: 'dataValues',
                type: 'create',
                data: (data) => data,
            }
            return engine.mutate(mutationObj, {
                variables: { ...params, ...variables },
            })
        },
    })

    return queryClient
}

export default useQueryClient
