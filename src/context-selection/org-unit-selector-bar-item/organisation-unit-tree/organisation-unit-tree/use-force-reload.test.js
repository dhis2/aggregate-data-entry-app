import { renderHook } from '@testing-library/react-hooks'
import { useForceReload } from './use-force-reload.js'

describe('OrganisationUnitTree - useForceReload', () => {
    it('should return an reloadIf of 0 when forceReload is false', () => {
        const expected = 0
        const { result } = renderHook(() => useForceReload(false))

        expect(result.current).toBe(expected)
    })

    it('should increase the default reloadId when forceReload is true', () => {
        const expected = 1
        const { result } = renderHook(() => useForceReload(true))

        expect(result.current).toBe(expected)
    })
})
