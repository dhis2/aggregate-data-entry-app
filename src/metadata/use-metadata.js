import { useQuery } from 'react-query'
import { createSelector } from 'reselect'
import { hashArraysInObject } from './utils.js'

const selectorFunction = createSelector(
    (data) => data,
    (data) => hashArraysInObject(data)
)

const queryKey = [`/dataEntry/metadata`]

const queryOpts = {
    refetchOnMount: false,
    select: selectorFunction,
    staleTime: 24 * 60 * 60 * 1000,
    meta: {
        persist: true,
    },
}

export const useMetadata = () => {
    const metadataQuery = useQuery(queryKey, queryOpts)
    return metadataQuery
}
