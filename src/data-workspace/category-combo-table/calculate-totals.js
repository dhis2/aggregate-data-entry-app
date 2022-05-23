export const calculateColumnTotals = (matrix) =>
    matrix.length < 2
        ? matrix[0].map((v) => Number(v) || 0)
        : matrix.reduce((totals, currRow) =>
              totals.map((currTotal, i) => sum(currTotal, currRow[i]))
          )

const sum = (acc, curr) => {
    const a = Number(curr) || 0
    const b = Number(acc) || 0
    return a + b
}

export const calculateRowTotal = (matrix, row = 0) => matrix[row].reduce(sum)
