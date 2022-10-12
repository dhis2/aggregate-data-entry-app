import { renderHook } from '@testing-library/react-hooks'
import { useMinMaxLimits } from './use-min-max-limits.js'

jest.mock('../shared/index.js', () => ({
    useValueStore: jest.fn().mockImplementation((func) => {
        const state = {
            getMinMaxValues: ({ dataElementId, categoryOptionComboId }) => {
                const mockValue = {
                    [`dataElementId123.categoryOptionComboId123`]: {
                        minValue: 5,
                        maxValue: 10,
                    },
                }

                return mockValue[`${dataElementId}.${categoryOptionComboId}`]
            },
        }

        return func(state)
    }),
}))

describe(`useMinMaxLimits`, () => {
    it('should return the min and max values when present for dataElement', () => {
        const { result } = renderHook(() =>
            useMinMaxLimits('dataElementId123', 'categoryOptionComboId123')
        )

        expect(result.current).toEqual({ min: 5, max: 10 })
    })

    it('should return undefined when not present for dataElement', () => {
        const { result } = renderHook(() =>
            useMinMaxLimits('dataElementId124', 'categoryOptionComboId123')
        )

        expect(result.current).toEqual({})
    })

    it('should return undefined when not present for categoryOptionCombo', () => {
        const { result } = renderHook(() =>
            useMinMaxLimits('dataElementId123', 'categoryOptionComboId124')
        )

        expect(result.current).toEqual({})
    })
})
