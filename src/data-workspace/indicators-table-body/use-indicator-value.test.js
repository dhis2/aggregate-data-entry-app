import { renderHook } from '@testing-library/react'
import { useValueStore } from '../../shared/stores/data-value-store.js'
import { computeIndicatorValue } from './compute-indicator-value.js'
import { useIndicatorValue } from './use-indicator-value.js'

jest.mock('./compute-indicator-value.js', () => {
    const originalModule = jest.requireActual('./compute-indicator-value.js')

    return {
        __esModule: true,
        ...originalModule,
        computeIndicatorValue: jest.fn(
            ({ dataValues }) =>
                (Number(dataValues.a.a1.value) +
                    Number(dataValues.b.b1.value)) /
                (Number(dataValues.c.c1.value) + Number(dataValues.d.d1.value))
        ),
    }
})

jest.mock('../../shared/stores/data-value-store.js', () => {
    return {
        ...jest.requireActual('../../shared/stores/data-value-store.js'),
        useValueStore: jest.fn(),
    }
})

const dataValueSet = {
    a: {
        a1: {
            categoryOptionCombo: 'a1',
            value: '60',
        },
    },
    b: {
        b1: {
            categoryOptionCombo: 'b1',
            value: '80',
        },
    },
    c: {
        c1: {
            categoryOptionCombo: 'c1',
            value: '3',
        },
    },
    d: {
        d1: {
            categoryOptionCombo: 'd1',
            value: '4',
        },
    },
}

describe('useIndicatorValue hook', () => {
    const initialProps = {
        denominator: '#{d.d1}+#{c.c1}',
        factor: 100,
        numerator: '#{a.a1}+#{b.b1}',
    }

    beforeEach(() => {
        jest.clearAllMocks()
    })

    it('should initialize the indicator value state correctly', () => {
        useValueStore.mockReturnValue(dataValueSet)

        const { result } = renderHook(
            ({ denominator, factor, numerator }) =>
                useIndicatorValue({
                    denominator,
                    factor,
                    numerator,
                }),
            {
                initialProps,
            }
        )

        expect(result.current).toBe(20)
        expect(computeIndicatorValue).toHaveBeenCalledTimes(1)
    })

    it('should not update the indicator value state if an unrelated field changes', () => {
        useValueStore.mockReturnValue(dataValueSet)

        const { result, rerender } = renderHook(
            ({ denominator, factor, numerator }) =>
                useIndicatorValue({
                    denominator,
                    factor,
                    numerator,
                }),
            {
                initialProps,
            }
        )

        expect(result.current).toBe(20)
        expect(computeIndicatorValue).toHaveBeenCalledTimes(1)

        useValueStore.mockReturnValue({
            ...dataValueSet,
            z: { z1: { categoryOptionCombo: 'd1', value: '11' } },
        })

        rerender({
            ...initialProps,
            /*
             * `z.z1` are not present as operands in the numerator or
             * denominator expression template. So when this field value is changed
             * the indicator value should not be recomputed.
             */
        })

        expect(result.current).toBe(20)
        expect(computeIndicatorValue).toHaveBeenCalledTimes(1)
    })
    it('should update the indicator value state if an related field changes', async () => {
        useValueStore.mockReturnValue(dataValueSet)

        const { result, rerender } = renderHook(
            ({ denominator, factor, numerator }) =>
                useIndicatorValue({
                    denominator,
                    factor,
                    numerator,
                }),
            {
                initialProps,
            }
        )

        expect(result.current).toBe(20)
        expect(computeIndicatorValue).toHaveBeenCalledTimes(1)

        useValueStore.mockReturnValue({
            ...dataValueSet,
            d: { d1: { categoryOptionCombo: 'd1', value: '11' } },
        })

        rerender({
            ...initialProps,
            /*
             * `d.d1` are present as operands in the numerator or
             * denominator expression template. So when this field value is changed
             * the indicator value should be recomputed.
             */
        })

        expect(result.current).toBe(10)
        expect(computeIndicatorValue).toHaveBeenCalledTimes(2)
    })
})
