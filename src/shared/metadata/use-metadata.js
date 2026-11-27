import { useQuery } from '@tanstack/react-query'
import { createSelector } from 'reselect'
import { hashArraysInObject } from './utils.js'

const selectorFunction = createSelector(
    (data) => data,
    (data) => hashArraysInObject(data)
)

export const metadataQueryKey = [`/dataEntry/metadata`]

const queryOpts = {
    refetchOnMount: false,
    select: selectorFunction,
    staleTime: 24 * 60 * 60 * 1000,
}

export const useMetadata = () => {
    const metadataQuery = useQuery(metadataQueryKey, queryOpts)
    return metadataQuery
}
