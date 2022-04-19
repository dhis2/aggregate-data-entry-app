import { useQuery } from 'react-query'
import { createSelector } from 'reselect'
import { hashArraysInObject } from './utils.js'

const selectorFunction = createSelector(
    (data) => data,
    (data) => hashArraysInObject(data)
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
