import { renderHook } from '@testing-library/react-hooks'
import { useClientServerDateUtils, getCurrentDate } from '../../shared/index.js'
import { computeDateLimit } from './use-date-limit.js'

jest.mock('../../shared/fixed-periods/get-current-date.js', () => ({
    __esModule: true,
    default: jest.fn(() => new Date()),
}))

jest.mock('../../shared/date/use-server-time-offset.js', () => ({
    __esModule: true,
    default: jest.fn(() => 0),
}))

/**
 * Should add future periods, even when spanning over several years
 */
describe('computeDateLimit', () => {
    getCurrentDate.mockImplementation(() => new Date('2022-09-27'))

    it('should be current date if no openFuturePeriods', () => {
        const { result } = renderHook(() => useClientServerDateUtils())
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
            fromClientDate: result.current.fromClientDate,
        })

        expect(actual).toEqual(new Date('2022-09-27'))
    })

    it('should be 2022-10-01 if current date: 2022-08-31, periodType: Monthly, openFuturePeriods: 2', () => {
        getCurrentDate.mockImplementation(() => new Date('2022-08-31'))
        const { result } = renderHook(() => useClientServerDateUtils())
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
            fromClientDate: result.current.fromClientDate,
        })
        const expected = new Date('2022-10-01')

        expect(actual.getTime()).toEqual(expected.getTime())
    })

    it('should be 2022-10-01 if current date: 2022-08-01, periodType: Monthly, openFuturePeriods: 2', () => {
        getCurrentDate.mockImplementation(() => new Date('2022-08-01'))
        const { result } = renderHook(() => useClientServerDateUtils())
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
            fromClientDate: result.current.fromClientDate,
        })
        const expected = new Date('2022-10-01')

        expect(actual.getTime()).toEqual(expected.getTime())
    })

    it('should be 2025-01-01 if current date: 2022-08-01, periodType: Yearly, openFuturePeriods: 3', () => {
        getCurrentDate.mockImplementation(() => new Date('2022-08-01'))
        const { result } = renderHook(() => useClientServerDateUtils())
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
            fromClientDate: result.current.fromClientDate,
        })
        const expected = new Date('2025-01-01')

        expect(actual.getTime()).toEqual(expected.getTime())
    })
})
