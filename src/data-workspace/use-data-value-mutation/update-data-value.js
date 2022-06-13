// Updates dataValue without mutating previousDataValueSet
export default function updateDataValue(
    previousDataValueSet,
    updatedDataValue,
    targetIndex
) {
    const newDataValues = [...previousDataValueSet.dataValues]
    newDataValues[targetIndex] = updatedDataValue

    return {
        ...previousDataValueSet,
        dataValues: newDataValues,
    }
}
