import getCurrentDate from '../../shared/fixed-periods/get-current-date.js'
import { computeDateLimit } from './use-date-limit.js'

jest.mock('../../shared/fixed-periods/get-current-date.js', () => ({
    __esModule: true,
    default: jest.fn(),
}))

/**
 * Should add future periods, even when spanning over several years
 */
describe('computeDateLimit', () => {
    afterEach(() => {
        getCurrentDate.mockClear()
    })

    it('should be current date if no openFuturePeriods', () => {
        getCurrentDate.mockImplementation(() => {
            return new Date()
        })

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

        const actual = computeDateLimit({
            dataSetId,
            metadata,
        })

        const expected = getCurrentDate()

        expect(actual).toEqual(expected)
    })

    it('should be 2022-10-01 if current date: 2022-08-31, periodType: Monthly, openFuturePeriods: 2', () => {
        getCurrentDate.mockImplementation(() => {
            return new Date('2022-08-31')
        })

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

        const actual = computeDateLimit({
            dataSetId,
            metadata,
        })

        const expected = new Date('2022-10-01')

        expect(actual.getTime()).toEqual(expected.getTime())
    })

    it('should be 2022-10-01 if current date: 2022-08-01, periodType: Monthly, openFuturePeriods: 2', () => {
        getCurrentDate.mockImplementation(() => {
            return new Date('2022-08-01')
        })

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

        const actual = computeDateLimit({
            dataSetId,
            metadata,
        })

        const expected = new Date('2022-10-01')

        expect(actual.getTime()).toEqual(expected.getTime())
    })

    it('should be 2025-01-01 if current date: 2022-08-01, periodType: Yearly, openFuturePeriods: 3', () => {
        getCurrentDate.mockImplementation(() => {
            return new Date('2022-08-01')
        })

        const dataSetId = 'dataSetId'
        const metadata = {
            dataSets: {
                dataSetId: {
                    id: 'dataSetId',
                    periodType: 'Yearly',
                    openFuturePeriods: 3,
                },
            },
        }

        const actual = computeDateLimit({
            dataSetId,
            metadata,
        })

        const expected = new Date('2025-01-01')

        expect(actual.getTime()).toEqual(expected.getTime())
    })
})
