import { useQuery } from 'react-query'
import keys from './query-key-factory.js'

const useCustomForms = () => {
    return useQuery(keys.all, {
        select: (data) =>
            data.dataSets
                .filter((dataSet) => dataSet.formType === 'CUSTOM')
                .map((dataSet) => ({
                    id: dataSet.dataEntryForm.id,
                    version: dataSet.version,
                })),
    })
}

export default useCustomForms
