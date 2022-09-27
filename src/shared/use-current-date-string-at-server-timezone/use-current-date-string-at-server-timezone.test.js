import { useConfig } from '@dhis2/app-runtime'
import getCurrentDate from '../fixed-periods/get-current-date.js'
import { useCurrentDateStringAtServerTimezone } from './use-current-date-string-at-server-timezone.js'

jest.mock('@dhis2/app-runtime', () => ({
    useConfig: jest.fn(() => ({
        systemInfo: { serverTimeZoneId: 'Etc/UTC' },
    })),
}))

jest.mock('../../shared/fixed-periods/get-current-date.js', () => ({
    __esModule: true,
    default: jest.fn(),
}))

describe('useCurrentDateStringAtServerTimezone hook', () => {
    /**
     * Client timezone is set to Etc/UTC when starting the test runner
     * See `package.json`:
     * "test": "TZ=Etc/UTC d2-app-scripts test",
     */

    it('changes to previous date when ahead of server time at day start', () => {
        const date = new Date('2021-08-31 00:01:00')
        getCurrentDate.mockReturnValueOnce(date)
        useConfig.mockReturnValueOnce({
            systemInfo: { serverTimeZoneId: 'Etc/GMT+2' },
        })
        const converted = useCurrentDateStringAtServerTimezone()

        expect(converted).toBe('2021-08-30')
    })

    it('changes to next date when behind of server time at day end', () => {
        const date = new Date('2021-08-30 23:59:00')
        getCurrentDate.mockReturnValueOnce(date)
        useConfig.mockReturnValueOnce({
            systemInfo: { serverTimeZoneId: 'Etc/GMT-2' },
        })
        const converted = useCurrentDateStringAtServerTimezone()

        expect(converted).toBe('2021-08-31')
    })
})