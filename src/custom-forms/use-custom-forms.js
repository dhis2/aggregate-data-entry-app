import { useQuery } from 'react-query'
import { createSelector } from 'reselect'
import keys from './query-key-factory.js'

const getDataSets = (data) => data.dataSets
const getCustomForms = createSelector(getDataSets, (dataSets) =>
    dataSets
        .filter((dataSet) => dataSet.formType === 'CUSTOM')
        .map((dataSet) => ({
            id: dataSet.dataEntryForm.id,
            version: dataSet.version,
        }))
)

const useCustomForms = () => {
    return useQuery(keys.all, {
        select: getCustomForms,
    })
}

export default useCustomForms
