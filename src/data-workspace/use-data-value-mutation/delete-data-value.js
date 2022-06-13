// Delete dataValue without mutating previousDataValueSet
export default function deleteDataValue(previousDataValueSet, matchIndex) {
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
