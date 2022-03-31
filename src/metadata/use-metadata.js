import { useQuery } from 'react-query'
import { createSelector } from 'reselect'
import { hashArraysInObject } from './utils.js'

const selectorFunction = createSelector(
    (data) => data,
    (data) => {
        // bug in API includes duplicate "default"-catCombo
        // one has categoryOptionCombos, and the other is missing properties
        // delete the one that is missing properties, so we ensure that the correct one is used
        const filtered = data.categoryCombos.filter(
            (cc) => !(cc.isDefault && !cc.categoryOptionCombos)
        )
        const filteredData = { ...data, categoryCombos: filtered }
        const result = hashArraysInObject(filteredData)
        console.log(result)
        return result
    }
)

const queryKey = [`dataSetMetadata`]

const queryOpts = {
    refetchOnMount: false,
    select: selectorFunction,
}

export const useMetadata = () => {
    const metadataQuery = useQuery(queryKey, queryOpts)
    return metadataQuery
}
