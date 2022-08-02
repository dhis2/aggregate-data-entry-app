import deleteDataValue from './delete-data-value.js'

export default async function optimisticallyDeleteDataValue({
    queryClient,
    newDataValue,
    dataValueSetQueryKey,
}) {
    // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
    await queryClient.cancelQueries(dataValueSetQueryKey)

    // Snapshot the previous value.
    // This query can be undefined when offline;
    // provide an empty 'response' for easier optimistic update
    const previousDataValueSet = queryClient.getQueryData(
        dataValueSetQueryKey
    ) ?? { dataValues: [], minMaxValues: [] }

    // Optimistically update to the new value
    queryClient.setQueryData(dataValueSetQueryKey, () => {
        // dataValueSet.dataValues can be undefined
        const previousDataValues = previousDataValueSet?.dataValues || []
        const matchIndex = previousDataValues.findIndex(
            (dataValue) =>
                dataValue.categoryOptionCombo === newDataValue.co &&
                dataValue.dataElement === newDataValue.de &&
                dataValue.orgUnit === newDataValue.ou &&
                dataValue.period === newDataValue.pe
        )

        return deleteDataValue(previousDataValueSet, matchIndex)
    })

    return { previousDataValueSet, dataValueSetQueryKey }
}
