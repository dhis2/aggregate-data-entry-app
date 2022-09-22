import { computeIndicatorValue } from './compute-indicator-value.js'

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
    it('returns an empty string when computed value would be NaN', () => {
        const value = computeIndicatorValue({
            numerator: '#{nothing}',
            denominator: '#{nothing_also}',
            factor: 1,
            formState,
        })
        expect(value).toBe('')
    })
    it('returns an empty string when computed value would be Infinity', () => {
        const value = computeIndicatorValue({
            numerator: '#{a}+#{b.b1}*#{c.c1}', // 3+2*3=9
            denominator: '#{nothing}',
            factor: 1,
            formState,
        })
        expect(value).toBe('')
    })
})
