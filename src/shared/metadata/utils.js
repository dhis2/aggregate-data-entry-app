export const hashById = (array) =>
    array.reduce((acc, curr) => {
        acc[curr.id] = curr
        return acc
    }, {})

export const hashArraysInObject = (result, hashFunction = hashById) =>
    Object.keys(result).reduce((acc, currKey) => {
        const prop = result[currKey]
        if (Array.isArray(prop)) {
            acc[currKey] = hashFunction(result[currKey])
        } else {
            acc[currKey] = prop
        }
        return acc
    }, {})
