import { computeIndicatorValue, round } from './compute-indicator-value.js'

describe('computeIndicatorValue', () => {
    const dataValues = {
        a: {
            a1: { value: '1' },
            a2: { value: '2' },
        },
        b: {
            b1: { value: '2' },
        },
        c: {
            c1: { value: '3' },
        },
        d: {
            d1: { value: '1' },
            d2: { value: '1' },
            d3: { value: '1' },
            d4: { value: '1' },
            d5: { value: '1' },
        },
    }
    it('produces a correct value for category option combos', () => {
        const result = computeIndicatorValue({
            numerator: '#{a.a1}+#{b.b1}*#{c.c1}', // 1+2*3=7
            denominator: '#{d.d1}*#{c.c1}', // 1*3=3
            factor: 1,
            dataValues,
        })
        expect(result.value).toBe(7 / 3)
        expect(result.numeratorValue).toBe(7)
        expect(result.denominatorValue).toBe(3)
    })
    it('produces a correct value for data elements', () => {
        const result = computeIndicatorValue({
            numerator: '#{a}+#{b.b1}*#{c.c1}', // 3+2*3=9
            denominator: '#{d}*#{c}', // 5*3=15
            factor: 1,
            dataValues,
        })
        expect(result.value).toBe(9 / 15)
        expect(result.numeratorValue).toBe(9)
        expect(result.denominatorValue).toBe(15)
    })
    it('produces a correct value when a factor is present', () => {
        const result = computeIndicatorValue({
            numerator: '#{a}+#{b.b1}*#{c.c1}', // 3+2*3=9
            denominator: '#{d}*#{c}', // 5*3=15
            factor: 100,
            dataValues,
        })
        expect(result.value).toBe((9 / 15) * 100)
        expect(result.numeratorValue).toBe(9)
        expect(result.denominatorValue).toBe(15)
    })
    it('returns noncalculable_value when expressions cannot be parsed', () => {
        const result = computeIndicatorValue({
            numerator: '#{a}.periodOffset(-1)',
            denominator: '#{nothing_also}',
            factor: 1,
            dataValues,
        })
        expect(result.value).toBe('noncalculable_value')
    })
    it('returns mathematically_invalid_value when computed value would be Infinity', () => {
        const result = computeIndicatorValue({
            numerator: '#{a}+#{b.b1}*#{c.c1}', // 3+2*3=9
            denominator: '#{nothing}',
            factor: 1,
            dataValues,
        })
        expect(result.value).toBe('mathematically_invalid_value')
    })
    it('returns mathematically_invalid_value when computed value would be NaN', () => {
        const result = computeIndicatorValue({
            numerator: 'sqrt(-1)',
            denominator: '#{nothing}',
            factor: 1,
        })
        expect(result.value).toBe('mathematically_invalid_value')
    })
    it('returns an appropriately rounded value', () => {
        const result = computeIndicatorValue({
            numerator: '#{a.a1}', // 1
            denominator: '#{c.c1}', // 3
            factor: 100,
            dataValues,
            decimals: 3,
        })
        expect(result.value).toBe(33.333)
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
