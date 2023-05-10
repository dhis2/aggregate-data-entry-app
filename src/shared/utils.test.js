import { cartesian, filterObject } from './utils.js'

describe('cartesian', () => {
    it('should return an empty array with no vector', () => {
        const actual = cartesian([])
        const expected = []
        expect(actual).toEqual(expected)
    })

    it('should return one single-value vector for each value when providing one vectors', () => {
        const actual = cartesian([[1, 2, 3]])
        const expected = [[1], [2], [3]]
        expect(actual).toEqual(expected)
    })

    it('should multiple two matrices', () => {
        const actual = cartesian([
            [1, 2, 3],
            [4, 5, 6],
        ])

        const expected = [
            [1, 4], [1, 5], [1, 6],
            [2, 4], [2, 5], [2, 6],
            [3, 4], [3, 5], [3, 6],
        ]

        expect(actual).toEqual(expected)
    })
})

describe('filterObject', () => {
    it('should remove all entries with "foo" in the key', () => {
        const input = { foo: 'foo', bar: 'bar', foobar: 'foobar' }
        const filterFn = ([key]) => !key.includes('foo')
        const actual = filterObject(input, filterFn)
        const expected = { bar: 'bar' }

        expect(actual).toEqual(expected)
    })
})
