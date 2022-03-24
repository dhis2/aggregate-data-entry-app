import { useMemo } from 'react'
import { useQuery } from 'react-query'
import { hashArraysInObject } from './utils.js'

const simpleQueryResultKeys = [
    'error',
    'errorUpdatedAt',
    'isError',
    'isFetched',
    'isFetchedAfterMount',
    'isFetching',
    'isIdle',
    'isLoading',
    'isLoadingError',
    'isPlaceholderData',
    'isPreviousData',
    'isRefetchError',
    'isRefetching',
    'isStale',
    'isSuccess',
]

export const useMetadata = () => {
    const metadataQueryKey = [
        'metadata',
        {
            params: {
                'categoryOptionCombos:fields':
                    'id,categoryOptions~pluck,categoryCombo,name',
            },
        },
    ]

    const queryKey = [`dataSetMetadata`]

    const metadataQuery = useQuery(queryKey, {
        select: (data) => hashArraysInObject(data),
    })

    // We need a seperate categoryOptionsCombo query for attributeOptionCombos
    // These are deliberately not included in /dataSetMetadata
    // since this set can grow so large.
    // This can be removed once the /dataValueSets API supports sending
    // categoryOptions and categoryCombo instead of the attributeOptionCombo
    // These are only used to find the selected attributeOptionCombo
    // Other categoryOptionCombos (used for data-values) are included under `categoryCombo.categoryOptionCombos`
    const categoryOptionsCombosQuery = useQuery(metadataQueryKey)

    const mergedQueries = useMemo(() => {
        const mergedSimpleProps = simpleQueryResultKeys.reduce(
            ({ acc, currKey }) => {
                acc[currKey] =
                    metadataQuery[currKey] || categoryOptionsCombosQuery
            },
            {}
        )

        let data = undefined
        if (metadataQuery.data && categoryOptionsCombosQuery.data) {
            data = {
                ...metadataQuery,
                attributeOptionCombos: categoryOptionsCombosQuery.data,
            }
        }

        return {
            ...categoryOptionsCombosQuery,
            ...metadataQuery,
            mergedSimpleProps,
            data,
            failureCount: Math.max(
                metadataQuery.failureCount,
                categoryOptionsCombosQuery.failureCount
            ),
            refetch: (refetchOpts) => {
                metadataQuery.refetch(refetchOpts)
                categoryOptionsCombosQuery.refetch(refetchOpts)
            },
            remove: () => {
                metadataQuery.remove()
                categoryOptionsCombosQuery.remove()
            },
        }
    }, [categoryOptionsCombosQuery, metadataQuery])

    return mergedQueries
}
