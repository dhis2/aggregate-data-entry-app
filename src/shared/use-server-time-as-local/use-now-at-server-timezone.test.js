import { useConfig } from '@dhis2/app-runtime'
import getCurrentDate from '../../shared/fixed-periods/get-current-date.js'
import { useNowAtServerTimezone } from './use-now-at-server-timezone.js'
import * as useServerDateTimeAsLocalModule from './use-server-date-time-as-local.js'

jest.mock('@dhis2/app-runtime', () => ({
    useConfig: jest.fn(() => ({
        systemInfo: { serverTimeZoneId: 'Etc/UTC' },
    })),
}))

jest.mock('../../shared/fixed-periods/get-current-date.js', () => ({
    __esModule: true,
    default: jest.fn(),
}))

describe('useNowAtServerTimezone hook', () => {
    /**
     * Client timezone is set to Etc/UTC when starting the test runner
     * See `package.json`:
     * "test": "TZ=Etc/UTC d2-app-scripts test",
     */
    it('calls the useServerDateTimeAsLocal hook with a string representation of the local now', () => {
        const now = new Date()
        getCurrentDate.mockReturnValueOnce(now)
        const spy = jest.spyOn(
            useServerDateTimeAsLocalModule,
            'useServerDateTimeAsLocal'
        )
        const converted = useNowAtServerTimezone()

        expect(spy).toHaveBeenCalledTimes(1)
        expect(spy).toHaveBeenCalledWith(now.toUTCString())
        expect(converted).toEqual(now)
    })

    it('changes to previous date when ahead of server time at day start', () => {
        const dateStr = '2021-08-31 00:01:00'
        const date = new Date(dateStr)
        getCurrentDate.mockReturnValueOnce(date)
        useConfig.mockReturnValueOnce({
            systemInfo: { serverTimeZoneId: 'Etc/GMT-2' },
        })
        const converted = useNowAtServerTimezone()

        expect(converted.getFullYear()).toBe(date.getFullYear())
        expect(converted.getMonth()).toBe(date.getMonth())
        expect(converted.getDate()).toBe(30)
    })
})
