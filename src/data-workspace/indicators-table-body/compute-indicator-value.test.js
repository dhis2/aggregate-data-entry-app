import { computeIndicatorValue, round } from './compute-indicator-value.js'

describe('computeIndicatorValue', () => {
    const formState = {
        values: {
            a: {
                a1: '1',
                a2: '2',
            },
            b: {
                b1: '2',
            },
            c: {
                c1: '3',
            },
            d: {
                d1: '1',
                d2: '1',
                d3: '1',
                d4: '1',
                d5: '1',
            },
        },
    }
    it('produces a correct value for category option combos', () => {
        const value = computeIndicatorValue({
            numerator: '#{a.a1}+#{b.b1}*#{c.c1}', // 1+2*3=7
            denominator: '#{d.d1}*#{c.c1}', // 1*3=3
            factor: 1,
            formState,
        })
        expect(value).toBe(7 / 3)
    })
    it('produces a correct value for data elements', () => {
        const value = computeIndicatorValue({
            numerator: '#{a}+#{b.b1}*#{c.c1}', // 3+2*3=9
            denominator: '#{d}*#{c}', // 5*3=15
            factor: 1,
            formState,
        })
        expect(value).toBe(9 / 15)
    })
    it('produces a correct value when a factor is present', () => {
        const value = computeIndicatorValue({
            numerator: '#{a}+#{b.b1}*#{c.c1}', // 3+2*3=9
            denominator: '#{d}*#{c}', // 5*3=15
            factor: 100,
            formState,
        })
        expect(value).toBe((9 / 15) * 100)
    })
    it('returns noncalculable_value when computed value would be NaN', () => {
        const value = computeIndicatorValue({
            numerator: '#{nothing}',
            denominator: '#{nothing_also}',
            factor: 1,
            formState,
        })
        expect(value).toBe('noncalculable_value')
    })
    it('returns noncalculable_value when computed value would be Infinity', () => {
        const value = computeIndicatorValue({
            numerator: '#{a}+#{b.b1}*#{c.c1}', // 3+2*3=9
            denominator: '#{nothing}',
            factor: 1,
            formState,
        })
        expect(value).toBe('noncalculable_value')
    })
    it('returns an appropriately rounded value', () => {
        const value = computeIndicatorValue({
            numerator: '#{a.a1}', // 1
            denominator: '#{c.c1}', // 3
            factor: 100,
            formState,
            decimals: 3,
        })
        expect(value).toBe(33.333)
    })
})

describe('round', () => {
    it('rounds to 2 values if decimals is 2', () => {
        const decimals = 2
        const originalValue = 3.1415926
        const roundedValue = round(originalValue, decimals)
        expect(roundedValue).toBe(3.14)
    })
    it('rounds to whole number if decimals is 0', () => {
        const decimals = 0
        const originalValue = 3.1415926
        const roundedValue = round(originalValue, decimals)
        expect(roundedValue).toBe(3)
    })
    it('rounds down if original value is negative', () => {
        const decimals = 1
        const originalValue = -3.1415926
        const roundedValue = round(originalValue, decimals)
        expect(roundedValue).toBe(-3.1)
    })
    it('returns NaN if original value is NaN', () => {
        const decimals = 3
        const originalValue = NaN
        const roundedValue = round(originalValue, decimals)
        expect(roundedValue).toBe(NaN)
    })
    it('returns the original value if decimals is not provided', () => {
        const decimals = undefined
        const originalValue = 3.1415926
        const roundedValue = round(originalValue, decimals)
        expect(roundedValue).toBe(originalValue)
    })
    it('returns the original value if decimals is not an integer', () => {
        const decimals = 2.71828
        const originalValue = 3.1415926
        const roundedValue = round(originalValue, decimals)
        expect(roundedValue).toBe(originalValue)
    })
    it('returns the original value if decimals is negative', () => {
        const decimals = -4
        const originalValue = 3.1415926
        const roundedValue = round(originalValue, decimals)
        expect(roundedValue).toBe(originalValue)
    })
})
