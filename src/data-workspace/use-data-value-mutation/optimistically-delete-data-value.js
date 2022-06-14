import deleteDataValue from './delete-data-value.js'

export default async function optimisticallyDeleteDataValue({
    queryClient,
    newDataValue,
    dataValueSetQueryKey,
}) {
    // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
    await queryClient.cancelQueries(dataValueSetQueryKey)

    // Snapshot the previous value
    const previousDataValueSet = queryClient.getQueryData(dataValueSetQueryKey)

    // Optimistically update to the new value
    queryClient.setQueryData(dataValueSetQueryKey, () => {
        // dataValueSet.dataValues can be undefined
        const previousDataValues = previousDataValueSet.dataValues || []
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
