import addDataValue from './add-data-value.js'
import getDataValueIndex from './get-data-value-index.js'
import updateDataValue from './update-data-value.js'

export default async function optimisticallySetDataValueComment({
    queryClient,
    newDataValue,
    dataValueSetQueryKey,
    attributeCombo,
    attributeOptions,
}) {
    // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
    await queryClient.cancelQueries(dataValueSetQueryKey)

    // Snapshot the previous value
    const previousDataValueSet = queryClient.getQueryData(dataValueSetQueryKey)

    // Optimistically update to the new value
    queryClient.setQueryData(dataValueSetQueryKey, () => {
        // dataValueSet.dataValues can be undefined
        const previousDataValues = previousDataValueSet.dataValues || []
        const matchIndex = getDataValueIndex(previousDataValues, newDataValue)
        const isNewDataValue = matchIndex === -1

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
            }

            return addDataValue(previousDataValueSet, formattedNewDataValue)
        } else {
            const { comment } = newDataValue
            const formattedNewDataValue = {
                ...previousDataValues[matchIndex],
                comment,
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
