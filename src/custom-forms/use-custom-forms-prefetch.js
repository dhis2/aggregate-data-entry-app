import { useQuery, useQueryClient } from 'react-query'
import keys from './query-key-factory.js'

const useCustomFormsPrefetch = () => {
    const queryClient = useQueryClient()
    const { isSuccess, data } = useQuery(keys.metadata, {
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
            const cachedCustomForm = queryClient.getQueryData(queryKey)

            if (!cachedCustomForm) {
                queryClient.prefetchQuery(queryKey)
                continue
            }

            const versionMatch = cachedCustomForm.version === customForm.version

            if (!versionMatch) {
                queryClient.prefetchQuery(queryKey)
            }
        }
    }
}

export default useCustomFormsPrefetch
