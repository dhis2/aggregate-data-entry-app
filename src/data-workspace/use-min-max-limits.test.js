import { renderHook } from '@testing-library/react-hooks'
import { useDataValueSet, useOrgUnitId } from '../shared/index.js'
import { useMinMaxLimits } from './use-min-max-limits.js'

jest.mock('../shared/index.js', () => ({
    useDataValueSet: jest.fn(),
    useOrgUnitId: jest.fn(),
}))

describe(`useMinMaxLimits`, () => {
    useOrgUnitId.mockReturnValue(['orgId123'])
    useDataValueSet.mockReturnValue({
        data: {
            minMaxValues: [
                {
                    orgUnit: 'orgId123',
                    categoryOptionCombo: 'categoryOptionComboId123',
                    dataElement: 'dataElementId123',
                    minValue: 5,
                    maxValue: 10,
                },
            ],
        },
    })

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

    it('should return undefined when not present for categoryOptionCombo', () => {
        useOrgUnitId.mockReturnValue(['orgId124'])
        const { result } = renderHook(() =>
            useMinMaxLimits('dataElementId123', 'categoryOptionComboId123')
        )

        expect(result.current).toEqual({})
    })
})
