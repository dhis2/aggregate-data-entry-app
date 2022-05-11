export const calculateColumnTotals = (matrix) =>
    matrix.reduce((rows, currRow) =>
        rows.map((val, i) => {
            const a = Number(currRow[i]) || 0
            const b = Number(val) || 0
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
