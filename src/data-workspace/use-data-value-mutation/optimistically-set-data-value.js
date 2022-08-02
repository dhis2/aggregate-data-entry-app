import addDataValue from './add-data-value.js'
import getPreviousDataValues from './get-previous-data-values.js'
import updateDataValue from './update-data-value.js'

export default async function optimisticallySetDataValue({
    queryClient,
    newDataValue,
    dataValueSetQueryKey,
    attributeCombo,
    attributeOptions,
}) {
    // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
    await queryClient.cancelQueries(dataValueSetQueryKey)

    // Snapshot the previous data values
    const previousDataValueSet = getPreviousDataValues({
        queryClient,
        dataValueSetQueryKey,
    })

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

        const isNewDataValue = matchIndex === -1

        // If this is a file-type data value, set value to some file metadata
        // so it's available offline. When DVSets is refetched, the value will
        // be replaced by a UID that will be handled in the FileResourceInput components
        const newValue = newDataValue.value

        // If the field was previously empty the dataValue won't exist yet
        if (isNewDataValue) {
            const formattedNewDataValue = {
                ...newDataValue,
                attributeCombo,
                attributeOptions,
                categoryOptionCombo: newDataValue.co,
                dataElement: newDataValue.de,
                orgUnit: newDataValue.ou,
                period: newDataValue.pe,
                value: newValue,
            }

            return addDataValue(previousDataValueSet, formattedNewDataValue)
        } else {
            const formattedNewDataValue = {
                ...previousDataValues[matchIndex],
                value: newValue,
            }

            return updateDataValue(
                previousDataValueSet,
                formattedNewDataValue,
                matchIndex
            )
        }
    })

    return { previousDataValueSet, dataValueSetQueryKey }
}
