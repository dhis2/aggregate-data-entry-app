import { act, renderHook } from '@testing-library/react-hooks'
import useClientServerDate from './use-client-server-date.js'
import useServerTimeOffset from './use-server-time-offset.js'

jest.mock('./use-server-time-offset.js', () => ({
    __esModule: true,
    default: jest.fn(() => 0),
}))

/**
 * Client timezone is set to Etc/UTC when starting the test runner
 * See `package.json`:
 * "test": "TZ=Etc/UTC d2-app-scripts test",
 */
describe('useClientServerDate', () => {
    it('throws an error when passing both a client- and a serverDate', () => {
        const clientDate = new Date('2022-10-13 10:00:00')
        const serverDate = new Date('2022-10-13 08:00:00')
        const { result } = renderHook(() =>
            useClientServerDate({ clientDate, serverDate })
        )
        expect(result.error).toEqual(
            new Error(
                '`useClientServerDate` does not accept both a client and a server date'
            )
        )
    })

    it('should return the client- & serverDate and setters', () => {
        useServerTimeOffset.mockImplementation(() => 7200000)
        const clientDate = new Date('2022-10-13 10:00:00')
        const { result } = renderHook(() => useClientServerDate({ clientDate }))

        expect(result.current).toEqual(
            expect.objectContaining({
                clientDate: new Date('2022-10-13 10:00:00'),
                serverDate: new Date('2022-10-13 08:00:00'),
            })
        )
        expect(typeof result.current.setClientDate).toBe('function')
        expect(typeof result.current.setServerDate).toBe('function')
    })

    it('should update the client- and serverDate when using the client date setter', async () => {
        useServerTimeOffset.mockImplementation(() => 7200000)
        const clientDate = new Date('2022-10-13 10:00:00')
        const { result, waitFor } = renderHook(() =>
            useClientServerDate({ clientDate })
        )

        act(() => {
            const nextClientDate = new Date('2022-10-13 13:00:00')
            result.current.setClientDate(nextClientDate)
        })

        await waitFor(() => {
            expect(result.current).toEqual(
                expect.objectContaining({
                    clientDate: new Date('2022-10-13 13:00:00'),
                    serverDate: new Date('2022-10-13 11:00:00'),
                })
            )
        })
    })

    it('should update the client- and serverDate when using the server date setter', async () => {
        useServerTimeOffset.mockImplementation(() => 7200000)
        const serverDate = new Date('2022-10-13 08:00:00')
        const { result, waitFor } = renderHook(() =>
            useClientServerDate({ serverDate })
        )

        act(() => {
            const nextServerDate = new Date('2022-10-13 11:00:00')
            result.current.setServerDate(nextServerDate)
        })

        await waitFor(() => {
            expect(result.current).toEqual(
                expect.objectContaining({
                    clientDate: new Date('2022-10-13 13:00:00'),
                    serverDate: new Date('2022-10-13 11:00:00'),
                })
            )
        })
    })
})
