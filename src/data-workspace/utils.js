// Computes the cartesian product of a matrix (array of array)
export const cartesian = (args) => {
    const result = []
    const lim = args.length - 1

    function add(row, i) {
        const len = args[i].length
        for (let j = 0; j < len; j++) {
            const a = [...row]
            a.push(args[i][j])
            if (i === lim) {
                result.push(a)
            } else {
                add(a, i + 1)
            }
        }
    }
    add([], 0)
    return result
}
// [[1,2,3]. [1,2]] => [[1,1],[1,2],[2,1],[2,2],[3,1],[3,2]]

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
