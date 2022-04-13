// Updates dataValue without mutating previousDataValueSet
export const updateDataValue = (
    previousDataValueSet,
    updatedDataValue,
    targetIndex
) => {
    const newDataValues = [...previousDataValueSet.dataValues]
    newDataValues[targetIndex] = updatedDataValue

    return {
        ...previousDataValueSet,
        dataValues: newDataValues,
    }
}

// Adds dataValue without mutating previousDataValueSet
export const addDataValue = (previousDataValueSet, newDataValue) => {
    return {
        ...previousDataValueSet,
        // dataValueSet.dataValues can be undefined
        dataValues: previousDataValueSet.dataValues
            ? [...previousDataValueSet.dataValues, newDataValue]
            : [newDataValue],
    }
}

// Delete dataValue without mutating previousDataValueSet
export const deleteDataValue = (previousDataValueSet, matchIndex) => {
    const previousDataValues = previousDataValueSet.dataValues
    const newDataValues = [
        ...previousDataValues.slice(0, matchIndex),
        ...previousDataValues.slice(matchIndex + 1),
    ]
    return {
        ...previousDataValueSet,
        dataValues: newDataValues,
    }
}
