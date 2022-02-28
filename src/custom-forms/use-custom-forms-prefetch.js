import { useQuery, useQueryClient } from 'react-query'
import keys from './query-key-factory.js'

const useCustomFormsPrefetch = () => {
    const queryClient = useQueryClient()
    const { isSuccess, data } = useQuery(keys.all, {
        select: (data) => data.dataSets,
    })

    if (isSuccess) {
        const customForms = data
            .filter((dataSet) => dataSet.formType === 'CUSTOM')
            .map((dataSet) => ({
                id: dataSet.dataEntryForm.id,
                version: dataSet.version,
            }))

        for (const customForm of customForms) {
            const queryKey = keys.byId(customForm.id)

            // Search the cache for a custom form with a matching version
            const cachedCustomForm = queryClient.getQueryData(queryKey, {
                predicate: (query) =>
                    customForm.version === query?.meta?.version,
            })

            if (!cachedCustomForm) {
                // Set the version on the query metadata so we can use that for comparing
                queryClient.prefetchQuery(queryKey, {
                    meta: { version: customForm.version },
                })
            }
        }
    }
}

export default useCustomFormsPrefetch
