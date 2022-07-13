import { renderHook } from '@testing-library/react-hooks'
import { computeIndicatorValue } from './compute-indicator-value.js'
import { useIndicatorValue } from './use-indicator-value.js'

jest.mock('./compute-indicator-value.js', () => {
    const originalModule = jest.requireActual('./compute-indicator-value.js')

    return {
        __esModule: true,
        ...originalModule,
        computeIndicatorValue: jest.fn(() => 10),
    }
})

describe('useIndicatorValue hook', () => {
    const mockForm = {
        getState: jest.fn(() => ({
            values: {},
        })),
    }
    const initialProps = {
        blurredField: undefined,
        denominator: '#{d}*#{c}',
        factor: 100,
        form: mockForm,
        numerator: '#{a}+#{b.b1}*#{c.c1}',
    }

    beforeEach(() => {
        jest.clearAllMocks()
    })

    it('should initialize the indicator value state correctly', () => {
        const { result } = renderHook(
            ({ blurredField, denominator, factor, form, numerator }) =>
                useIndicatorValue({
                    blurredField,
                    denominator,
                    factor,
                    form,
                    numerator,
                }),
            {
                initialProps,
            }
        )
        expect(result.current).toBe(10)
        expect(computeIndicatorValue).toHaveBeenCalledTimes(1)
    })

    it('should not update the indicator value state if an unrelated field changes', () => {
        const { result, rerender } = renderHook(
            ({ blurredField, denominator, factor, form, numerator }) =>
                useIndicatorValue({
                    blurredField,
                    denominator,
                    factor,
                    form,
                    numerator,
                }),
            {
                initialProps,
            }
        )
        rerender({
            ...initialProps,
            blurredField: 'z',
        })

        expect(result.current).toBe(10)
        expect(computeIndicatorValue).toHaveBeenCalledTimes(1)
    })
    it('should update the indicator value state if an related field changes', () => {
        const { result, rerender } = renderHook(
            ({ blurredField, denominator, factor, form, numerator }) =>
                useIndicatorValue({
                    blurredField,
                    denominator,
                    factor,
                    form,
                    numerator,
                }),
            {
                initialProps,
            }
        )
        rerender({
            ...initialProps,
            blurredField: 'd.d1',
        })

        expect(result.current).toBe(10)
        expect(computeIndicatorValue).toHaveBeenCalledTimes(2)
    })
})
