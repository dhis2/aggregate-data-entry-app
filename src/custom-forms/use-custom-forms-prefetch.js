import { useQuery, useQueryClient } from 'react-query'
import customForm from './query-key-factory.js'

const useCustomFormsPrefetch = () => {
    const queryClient = useQueryClient()
    const { isSuccess, data } = useQuery(customForm.all(), {
        select: (data) => data.dataSets,
    })

    if (isSuccess) {
        // dataSet ids for dataSets that have a custom form
        const customFormDataSets = data.filter(
            (dataSet) => dataSet.formType === 'CUSTOM'
        )

        for (const dataSet of customFormDataSets) {
            const queryKey = customForm.htmlCode(dataSet.id)

            // Prefetch and skip the rest of the block if there's no cached data
            const cachedHtmlCode = queryClient.getQueryData(queryKey)
            if (!cachedHtmlCode) {
                queryClient.prefetchQuery(queryKey)
                continue
            }

            const versionMatch = cachedHtmlCode.version === dataSet.version
            if (!versionMatch) {
                queryClient.prefetchQuery(queryKey)
            }
        }
    }
}

export default useCustomFormsPrefetch
