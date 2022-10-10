import { useConfig } from '@dhis2/app-runtime'
import getCurrentDate from '../fixed-periods/get-current-date.js'
import useClientDateAtServerTimezone from './use-client-date-at-server-timezone.js'

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
    const systemInfo = { serverTimeZoneId: 'Etc/UTC' }
    useConfig.mockReturnValue({ systemInfo })

    /**
     * Client timezone is set to Etc/UTC when starting the test runner
     * See `package.json`:
     * "test": "TZ=Etc/UTC d2-app-scripts test",
     */

    it('changes to later date when ahead of server time at day start', () => {
        getCurrentDate.mockImplementation(() => new Date('2021-10-10 00:00:00-02:00'))
        const date = new Date('2021-08-30 22:01:00-02:00')
        const actual = useClientDateAtServerTimezone(date)
        const expected = new Date('2021-08-31 00:01:00')
        expect(actual).toEqual(expected)
    })

    it('changes to older date when behind of server time at day end', () => {
        getCurrentDate.mockImplementation(() => new Date('2021-10-10 00:00:00+02:00'))
        const date = new Date('2021-08-31 00:01:00+02:00')
        const actual = useClientDateAtServerTimezone(date)
        const expected = new Date('2021-08-30 22:01:00')
        expect(actual).toEqual(expected)
    })
})
