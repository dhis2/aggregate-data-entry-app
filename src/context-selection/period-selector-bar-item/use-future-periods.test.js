import getCurrentDate from '../../shared/fixed-periods/get-current-date.js'
import { computeFuturePeriods } from './use-future-periods.js'

jest.mock('../../shared/fixed-periods/get-current-date.js', () => ({
    __esModule: true,
    default: jest.fn(),
}))

/**
 * Should add future periods, even when spanning over several years
 */
describe('computeFuturePeriods', () => {
    beforeEach(() => {
        getCurrentDate.mockImplementation(() => {
            return new Date('2022-07-01')
        })
    })

    afterEach(() => {
        getCurrentDate.mockClear()
    })

    it('should include future periods when "openFuturePeriods" is > 0', () => {
        const dateFormat = 'yyyy-mm-dd'
        const dataSetId = 'dataSetId'
        const metadata = {
            dataSets: {
                dataSetId: {
                    id: 'dataSetId',
                    periodType: 'Monthly',
                    openFuturePeriods: 27,
                },
            },
        }

        const actual = computeFuturePeriods({
            dateFormat,
            dataSetId,
            metadata,
        })

        const expected = expect.arrayContaining([
            expect.objectContaining({
                displayName: 'July 2022',
                endDate: '2022-07-31',
                id: '202207',
                iso: '202207',
                startDate: '2022-07-01',
            }),
            expect.objectContaining({
                displayName: 'August 2022',
                endDate: '2022-08-31',
                id: '202208',
                iso: '202208',
                startDate: '2022-08-01',
            }),
            expect.objectContaining({
                displayName: 'September 2022',
                endDate: '2022-09-30',
                id: '202209',
                iso: '202209',
                startDate: '2022-09-01',
            }),
            expect.objectContaining({
                displayName: 'October 2022',
                endDate: '2022-10-31',
                id: '202210',
                iso: '202210',
                startDate: '2022-10-01',
            }),
            expect.objectContaining({
                displayName: 'November 2022',
                endDate: '2022-11-30',
                id: '202211',
                iso: '202211',
                startDate: '2022-11-01',
            }),
            expect.objectContaining({
                displayName: 'December 2022',
                endDate: '2022-12-31',
                id: '202212',
                iso: '202212',
                startDate: '2022-12-01',
            }),
            expect.objectContaining({
                displayName: 'January 2023',
                endDate: '2023-01-31',
                id: '202301',
                iso: '202301',
                startDate: '2023-01-01',
            }),
            expect.objectContaining({
                displayName: 'February 2023',
                endDate: '2023-02-28',
                id: '202302',
                iso: '202302',
                startDate: '2023-02-01',
            }),
            expect.objectContaining({
                displayName: 'March 2023',
                endDate: '2023-03-31',
                id: '202303',
                iso: '202303',
                startDate: '2023-03-01',
            }),
            expect.objectContaining({
                displayName: 'April 2023',
                endDate: '2023-04-30',
                id: '202304',
                iso: '202304',
                startDate: '2023-04-01',
            }),
            expect.objectContaining({
                displayName: 'May 2023',
                endDate: '2023-05-31',
                id: '202305',
                iso: '202305',
                startDate: '2023-05-01',
            }),
            expect.objectContaining({
                displayName: 'June 2023',
                endDate: '2023-06-30',
                id: '202306',
                iso: '202306',
                startDate: '2023-06-01',
            }),
            expect.objectContaining({
                displayName: 'July 2023',
                endDate: '2023-07-31',
                id: '202307',
                iso: '202307',
                startDate: '2023-07-01',
            }),
            expect.objectContaining({
                displayName: 'August 2023',
                endDate: '2023-08-31',
                id: '202308',
                iso: '202308',
                startDate: '2023-08-01',
            }),
            expect.objectContaining({
                displayName: 'September 2023',
                endDate: '2023-09-30',
                id: '202309',
                iso: '202309',
                startDate: '2023-09-01',
            }),
            expect.objectContaining({
                displayName: 'October 2023',
                endDate: '2023-10-31',
                id: '202310',
                iso: '202310',
                startDate: '2023-10-01',
            }),
            expect.objectContaining({
                displayName: 'November 2023',
                endDate: '2023-11-30',
                id: '202311',
                iso: '202311',
                startDate: '2023-11-01',
            }),
            expect.objectContaining({
                displayName: 'December 2023',
                endDate: '2023-12-31',
                id: '202312',
                iso: '202312',
                startDate: '2023-12-01',
            }),
            expect.objectContaining({
                displayName: 'January 2024',
                endDate: '2024-01-31',
                id: '202401',
                iso: '202401',
                startDate: '2024-01-01',
            }),
            expect.objectContaining({
                displayName: 'February 2024',
                endDate: '2024-02-29',
                id: '202402',
                iso: '202402',
                startDate: '2024-02-01',
            }),
            expect.objectContaining({
                displayName: 'March 2024',
                endDate: '2024-03-31',
                id: '202403',
                iso: '202403',
                startDate: '2024-03-01',
            }),
            expect.objectContaining({
                displayName: 'April 2024',
                endDate: '2024-04-30',
                id: '202404',
                iso: '202404',
                startDate: '2024-04-01',
            }),
            expect.objectContaining({
                displayName: 'May 2024',
                endDate: '2024-05-31',
                id: '202405',
                iso: '202405',
                startDate: '2024-05-01',
            }),
            expect.objectContaining({
                displayName: 'June 2024',
                endDate: '2024-06-30',
                id: '202406',
                iso: '202406',
                startDate: '2024-06-01',
            }),
            expect.objectContaining({
                displayName: 'July 2024',
                endDate: '2024-07-31',
                id: '202407',
                iso: '202407',
                startDate: '2024-07-01',
            }),
            expect.objectContaining({
                displayName: 'August 2024',
                endDate: '2024-08-31',
                id: '202408',
                iso: '202408',
                startDate: '2024-08-01',
            }),
            expect.objectContaining({
                displayName: 'September 2024',
                endDate: '2024-09-30',
                id: '202409',
                iso: '202409',
                startDate: '2024-09-01',
            }),
        ])

        expect(actual).toEqual(expected)
    })

    it('should not include any future periods', () => {
        getCurrentDate.mockImplementation(() => {
            return new Date('2022-07-01')
        })

        const dateFormat = 'yyyy-mm-dd'
        const dataSetId = 'dataSetId'
        const metadata = {
            dataSets: {
                dataSetId: {
                    id: 'dataSetId',
                    periodType: 'Monthly',
                    openFuturePeriods: 0,
                },
            },
        }

        const actual = computeFuturePeriods({
            dateFormat,
            dataSetId,
            metadata,
        })

        const expected = []

        expect(actual).toEqual(expected)
    })

    it('should include two future periods after the current date', () => {
        getCurrentDate.mockImplementation(() => {
            return new Date('2022-07-01')
        })

        const dateFormat = 'yyyy-mm-dd'
        const dataSetId = 'dataSetId'
        const metadata = {
            dataSets: {
                dataSetId: {
                    id: 'dataSetId',
                    periodType: 'Monthly',
                    openFuturePeriods: 2,
                },
            },
        }

        const actual = computeFuturePeriods({
            dateFormat,
            dataSetId,
            metadata,
        })

        const expected = expect.arrayContaining([
            expect.objectContaining({
                displayName: 'July 2022',
                endDate: '2022-07-31',
                id: '202207',
                iso: '202207',
                startDate: '2022-07-01',
            }),
            expect.objectContaining({
                displayName: 'August 2022',
                endDate: '2022-08-31',
                id: '202208',
                iso: '202208',
                startDate: '2022-08-01',
            }),
        ])

        expect(actual).toEqual(expected)
    })
})
