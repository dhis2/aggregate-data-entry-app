export function findDataValueIndex(
    previousDataValues,
    dataValueMutationParams
) {
    const { co, de } = dataValueMutationParams

    return previousDataValues.findIndex(
        (dataValue) =>
            dataValue.categoryOptionCombo === co && dataValue.dataElement === de
    )
}

/**
 * Reformats data value mutation properties to match the properties returned by
 * the `dataEntry/dataValues` query
 */
function formatDataValue({ variables, dataValueMutationParams: dvmParams }) {
    return {
        ...variables, // might be `value` or `comment`
        attribute: {
            combo: dvmParams.cc,
            options: dvmParams.cp,
        },
        categoryOptionCombo: dvmParams.co,
        dataElement: dvmParams.de,
        orgUnit: dvmParams.ou,
        period: dvmParams.pe,
    }
}

/** Returns a new query data object without mutating previous version */
export function setDataValueInQueryData({
    previousQueryData,
    dataValueIndex,
    variables,
    dataValueMutationParams,
}) {
    // If the field was previously empty the dataValue won't exist yet
    const isNewDataValue = dataValueIndex === -1

    if (isNewDataValue) {
        // Create a new data value object and add it to the `dataValues` array
        const newDataValue = formatDataValue({
            variables,
            dataValueMutationParams,
        })

        // previousQueryData.dataValues can be undefined
        const newDataValues = previousQueryData.dataValues
            ? [...previousQueryData.dataValues, newDataValue]
            : [newDataValue]

        return {
            ...previousQueryData,
            dataValues: newDataValues,
        }
    } else {
        // This DV already exists; update the previous object and replace it
        // in a copied `dataValues` array.
        // Works for `value`, `comment`, and `followUp` properties, f.ex.
        const updatedDataValue = {
            ...previousQueryData.dataValues[dataValueIndex],
            ...variables,
        }

        // Deleting a value removes the flag on it from the API. We need to have the same behaviour in the
        // optimistic update, otherwise the flag keeps being shown until the user refreshes the app
        if (variables.value === '') {
            updatedDataValue.followUp = false
        }

        const newDataValues = [...previousQueryData.dataValues]
        newDataValues[dataValueIndex] = updatedDataValue

        return {
            ...previousQueryData,
            dataValues: newDataValues,
        }
    }
}

/** Returns a new query data object without mutating previous version */
export function deleteDataValueFromQueryData({
    previousQueryData,
    dataValueIndex,
    // `variables` arg not used (unlike above functions)
    // `dataValueMutationParams` arg not used
}) {
    const previousDataValues = previousQueryData.dataValues
    const newDataValues = [
        ...previousDataValues.slice(0, dataValueIndex),
        ...previousDataValues.slice(dataValueIndex + 1),
    ]

    return {
        ...previousQueryData,
        dataValues: newDataValues,
    }
}
