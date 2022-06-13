// Adds dataValue without mutating previousDataValueSet
export default function addDataValue(previousDataValueSet, newDataValue) {
    return {
        ...previousDataValueSet,
        // dataValueSet.dataValues can be undefined
        dataValues: previousDataValueSet.dataValues
            ? [...previousDataValueSet.dataValues, newDataValue]
            : [newDataValue],
    }
}
