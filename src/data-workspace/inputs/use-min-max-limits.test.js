import { renderHook } from '@testing-library/react-hooks'
import { useDataValueSet } from '../../shared/index.js'
import { useMinMaxLimits } from './use-min-max-limits.js'

jest.mock('../../shared/index.js', () => ({
    useDataValueSet: jest.fn(),
}))

describe(`useMinMaxLimits`, () => {
    useDataValueSet.mockReturnValue({
        data: {
            minMaxValues: [
                { dataElement: 'dataElementId123', minValue: 5, maxValue: 10 },
            ],
        },
    })

    it('should return the min and max values when present for dataElement', () => {
        const { result } = renderHook(() => useMinMaxLimits('dataElementId123'))

        expect(result.current).toEqual({ min: 5, max: 10 })
    })

    it('should return undefined when not present for dataElement', () => {
        const { result } = renderHook(() => useMinMaxLimits('dataElementId124'))

        expect(result.current).toBeUndefined()
    })
})
