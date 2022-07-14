import { calculateColumnTotals, calculateRowTotal } from './calculate-totals.js'

describe('Calculate totals', () => {
    describe('calculateColumnTotals', () => {
        it('should return an array with the correct total for each column', () => {
            const matrix = [
                [1, 2],
                [3, 4],
            ]

            expect(calculateColumnTotals(matrix)).toEqual([4, 6])
        })

        it('should ignore fields that are not numbers and fallback to 0', () => {
            const matrix = [
                [1, 2, undefined],
                ['af', 3, null],
            ]

            expect(calculateColumnTotals(matrix)).toEqual([1, 5, 0])
        })

        it('should parse and calculate correct total if field is a valid string-number', () => {
            const matrix = [
                [1, '2'],
                ['3', 4],
            ]

            expect(calculateColumnTotals(matrix)).toEqual([4, 6])
        })

        it('should fallback to 0 if all values in a column is not a number', () => {
            const matrix = [
                ['Value', 1],
                ['Another value', 2],
            ]

            expect(calculateColumnTotals(matrix)).toEqual([0, 3])
        })

        it('should handle empty matrix gracefully', () => {
            const matrix = [[]]

            expect(calculateColumnTotals(matrix)).toEqual([])
        })

        it('should handle single value-matrix', () => {
            const matrix = [[1]]
            expect(calculateColumnTotals(matrix)).toEqual([1])
        })

        it('should handle single value-matrix that is not a valid number', () => {
            const matrix = [['value']]
            expect(calculateColumnTotals(matrix)).toEqual([0])
        })
    })

    describe('calculateRowTotal', () => {
        it('should return the total for the row', () => {
            const matrix = [
                [1, 2],
                [3, 4],
            ]

            expect(calculateRowTotal(matrix, 0)).toEqual(3)
            expect(calculateRowTotal(matrix, 1)).toEqual(7)
        })

        it('should ignore fields that are not numbers and fallback to 0', () => {
            const matrix = [
                [1, 2, undefined],
                ['af', 3, null],
            ]

            expect(calculateRowTotal(matrix, 0)).toEqual(3)
            expect(calculateRowTotal(matrix, 1)).toEqual(3)
        })

        it('should parse and calculate correct total if field is a valid string-number', () => {
            const matrix = [
                [1, '2'],
                ['3', 4],
            ]

            expect(calculateRowTotal(matrix, 0)).toEqual(3)
            expect(calculateRowTotal(matrix, 1)).toEqual(7)
        })

        it('should fallback to 0 if all values in a row is not a number', () => {
            const matrix = [
                ['Value', 'Another value'],
                [1, 2],
            ]

            expect(calculateRowTotal(matrix, 0)).toEqual(0)
            expect(calculateRowTotal(matrix, 1)).toEqual(3)
        })

        it('should fallback to first row if no row-param is given', () => {
            const matrix = [
                [1, 2],
                [3, 5],
                [35, 223],
            ]
            expect(calculateRowTotal(matrix)).toEqual(3)
        })

        it('should handle empty matrix gracefully', () => {
            const matrix = [[]]

            expect(calculateRowTotal(matrix)).toEqual(0)
        })

        it('should handle single value-matrix', () => {
            const matrix = [[1]]
            expect(calculateRowTotal(matrix)).toEqual(1)
        })

        it('should handle single value-matrix that is not a valid number', () => {
            const matrix = [['value']]
            expect(calculateRowTotal(matrix)).toEqual(0)
        })
    })
})
