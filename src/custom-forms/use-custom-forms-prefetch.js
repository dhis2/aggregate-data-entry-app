import { useQuery, useQueryClient } from 'react-query'
import customForm from './query-key-factory.js'

const useCustomFormsPrefetch = () => {
    const queryClient = useQueryClient()
    const { isSuccess, data } = useQuery(customForm.all(), {
        select: (data) => data.dataSets,
    })

    if (isSuccess) {
        // dataSet ids for dataSets that have a custom form
        const dataSetIds = data
            .filter((dataSet) => dataSet.formType === 'CUSTOM')
            .filter((dataSet) => dataSet?.id)
            .map((dataSet) => dataSet.id)

        for (const id of dataSetIds) {
            queryClient.prefetchQuery(customForm.htmlCode(id))
        }
    }
}

export default useCustomFormsPrefetch
