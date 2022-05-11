export const calculateColumnTotals = (matrix) =>
    matrix.reduce((totals, currRow) =>
        totals.map((currTotal, i) => {
            const a = Number(currRow[i]) || 0
            const b = Number(currTotal) || 0
            return a + b
        })
    )

export const calculateRowTotals = (matrix) =>
    matrix.map((row) =>
        row.reduce((acc, curr) => {
            const a = Number(curr) || 0
            return acc + a
        }, 0)
    )
