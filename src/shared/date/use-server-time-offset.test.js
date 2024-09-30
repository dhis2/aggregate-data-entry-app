import { useConfig } from '@dhis2/app-runtime'
import { renderHook } from '@testing-library/react'
import useServerTimeOffset from './use-server-time-offset.js'

jest.mock('@dhis2/app-runtime', () => ({
    useConfig: jest.fn(() => ({
        systemInfo: { serverTimeZoneId: 'Etc/UTC' },
    })),
}))

/**
 * Client timezone is set to Etc/UTC when starting the test runner
 * See `package.json`:
 * "test": "TZ=Etc/UTC d2-app-scripts test",
 */
describe('useServerTimeOffset', () => {
    it('return an offset of 0 when in the same timezone as the server', () => {
        const timeZone = 'Etc/UTC'
        const systemInfo = { serverTimeZoneId: timeZone }
        useConfig.mockReturnValue({ systemInfo })

        const expected = 0
        const { result } = renderHook(() => useServerTimeOffset())
        const actual = result.current

        expect(actual).toBe(expected)
    })

    it('returns a negative offset when ahead of server time', () => {
        const timeZone = 'Etc/GMT-2'
        const systemInfo = { serverTimeZoneId: timeZone }
        useConfig.mockReturnValue({ systemInfo })

        const expected = -7200000
        const { result } = renderHook(() => useServerTimeOffset())
        const actual = result.current

        expect(actual).toBe(expected)
    })

    it('returns a positive offset when behind of server time', () => {
        const timeZone = 'Etc/GMT+2'
        const systemInfo = { serverTimeZoneId: timeZone }
        useConfig.mockReturnValue({ systemInfo })

        const expected = 7200000
        const { result } = renderHook(() => useServerTimeOffset())
        const actual = result.current

        expect(actual).toBe(expected)
    })

    it('returns no offset when server time zone is invalid', () => {
        const timeZone = 'Invalid time zone'
        const systemInfo = { serverTimeZoneId: timeZone }
        useConfig.mockReturnValue({ systemInfo })

        const expected = 0
        const { result } = renderHook(() => useServerTimeOffset())
        const actual = result.current

        expect(actual).toBe(expected)
    })
})
