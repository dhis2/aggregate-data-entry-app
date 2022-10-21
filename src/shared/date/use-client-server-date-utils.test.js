import { renderHook } from '@testing-library/react-hooks'
import useClientServerDateUtils from './use-client-server-date-utils.js'
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
describe('useClientServerDateUtils', () => {
    it('provides a function to start with a client date', () => {
        useServerTimeOffset.mockImplementation(() => 7200000)

        const { result } = renderHook(() => useClientServerDateUtils())
        const { fromClientDate } = result.current
        const clientDate = new Date('2022-10-13 10:00:00')
        const actual = fromClientDate(clientDate)
        const expected = {
            clientDate: new Date('2022-10-13 10:00:00'),
            serverDate: new Date('2022-10-13 08:00:00'),
        }

        expect(actual).toEqual(expected)
    })

    it('provides a function to start with a server date', () => {
        useServerTimeOffset.mockImplementation(() => 7200000)

        const { result } = renderHook(() => useClientServerDateUtils())
        const { fromServerDate } = result.current
        const serverDate = new Date('2022-10-13 10:00:00')
        const actual = fromServerDate(serverDate)
        const expected = {
            clientDate: new Date('2022-10-13 12:00:00'),
            serverDate: new Date('2022-10-13 10:00:00'),
        }

        expect(actual).toEqual(expected)
    })
})
