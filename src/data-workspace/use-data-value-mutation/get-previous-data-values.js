// Note that this `dataValues` object used to be called `dataValueSet`;
// names may be inconsistent

/**
 * Gets previous data values to optimistically update. Since the data for the
 * `dataEntry/dataValues` query can be undefined when offline, a default empty
 * response object is returned in that case to allow optimistic updates.
 */
export default function getPreviousDataValues({
    queryClient,
    dataValueSetQueryKey,
}) {
    return (
        // The data for this query can be undefined when offline.
        // In that case, return an empty response object to optimistically update
        queryClient.getQueryData(dataValueSetQueryKey) ?? {
            dataValues: [],
            minMaxValues: [],
        }
    )
}
