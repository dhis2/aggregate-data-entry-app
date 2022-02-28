import { useQueryClient } from 'react-query'
import keys from './query-key-factory.js'
import useCustomForms from './use-custom-forms.js'

const useCustomFormsPrefetch = () => {
    const queryClient = useQueryClient()
    const { isSuccess, data } = useCustomForms()

    if (isSuccess) {
        for (const customForm of data) {
            const queryKey = keys.byId(customForm.id)

            // Search the cache for a custom form with a matching version
            const cachedCustomForm = queryClient.getQueryData(queryKey, {
                predicate: (query) =>
                    customForm.version === query?.meta?.version,
            })

            if (!cachedCustomForm) {
                // Set the version on the query metadata so we can use that for comparing
                queryClient.prefetchQuery(queryKey, {
                    meta: {
                        version: customForm.version,
                        persist: true,
                    },
                })
            }
        }
    }
}

export default useCustomFormsPrefetch
