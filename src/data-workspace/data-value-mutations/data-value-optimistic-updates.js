import {
    findDataValueIndex,
    setDataValueInQueryData,
    deleteDataValueFromQueryData,
} from './optimistic-update-helpers.js'

/**
 * Optimistically update the query to `dataEntry/dataValues` with newly entered
 * data -- this will improve performance and correctly update the cached
 * data values while offline.
 *
 * This takes some formatting because the data value object properties differ
 * between the `dataEntry/dataValues` query and the data sent for `dataValues`
 * mutations
 */
function sharedOptimisticUpdate({
    variables,
    dataValueMutationParams,
    queryClient,
    dataValueSetQueryKey,
    updateQueryDataFunction,
}) {
    return queryClient.setQueryData(dataValueSetQueryKey, (queryData) => {
        // Query data can be undefined when offline
        const previousQueryData = queryData ?? {
            dataValues: [],
            minMaxValues: [],
        }
        // dataValueSet.dataValues can be undefined for empty forms (bug?)
        const previousDataValues = previousQueryData.dataValues || []

        const dataValueIndex = findDataValueIndex(
            previousDataValues,
            dataValueMutationParams
        )

        const newQueryData = updateQueryDataFunction({
            previousQueryData,
            dataValueIndex,
            variables,
            dataValueMutationParams,
        })

        return newQueryData
    })
}

/**
 * This function merges variables into potentially preexisting data value
 * object (see `setDataValueInQueryData`)
 */
export function optimisticallySetDataValue({
    variables,
    dataValueMutationParams,
    queryClient,
    dataValueSetQueryKey,
}) {
    return sharedOptimisticUpdate({
        variables,
        dataValueMutationParams,
        queryClient,
        dataValueSetQueryKey,
        updateQueryDataFunction: setDataValueInQueryData,
    })
}
export function optimisticallySetFileDataValue({
    variables,
    dataValueMutationParams,
    queryClient,
    dataValueSetQueryKey,
}) {
    return sharedOptimisticUpdate({
        // For this file-type data value, set `value` in the cache to some file
        // metadata so it's available offline. When `dataEntry/dataValues` is
        // refetched, this value will be replaced by a file resource UID that
        // the FileResourceInput components will use to get metadata
        variables: {
            value: { name: variables.file?.name, size: variables.file?.size },
        },
        dataValueMutationParams,
        queryClient,
        dataValueSetQueryKey,
        updateQueryDataFunction: setDataValueInQueryData,
    })
}
export function optimisticallyDeleteDataValue({
    // variables, -- not used in this function
    dataValueMutationParams,
    queryClient,
    dataValueSetQueryKey,
}) {
    return sharedOptimisticUpdate({
        dataValueMutationParams,
        queryClient,
        dataValueSetQueryKey,
        updateQueryDataFunction: deleteDataValueFromQueryData,
    })
}
