import { renderHook } from '@testing-library/react'
import usePeriods from './use-periods.js'

jest.mock('../../shared/use-user-info/use-user-info.js', () => ({
    useUserInfo: jest.fn(() => ({
        data: {
            settings: { keyUiLocale: 'en' },
        },
    })),
}))

jest.mock('../../shared/date/use-server-time-offset.js', () => ({
    __esModule: true,
    default: jest.fn(() => 0),
}))

describe('usePeriods', () => {
    const actualSystemTime = new Date()
    jest.useFakeTimers()

    afterEach(() => {
        jest.setSystemTime(actualSystemTime)
    })

    it('should return a list of daily periods', () => {
        const periodType = 'DAILY'
        const openFuturePeriods = 0
        const year = 2023
        const dateLimit = new Date('2023-03-01')

        const { result } = renderHook(() =>
            usePeriods({
                periodType,
                openFuturePeriods,
                year,
                dateLimit,
            })
        )

        expect(result.current).toHaveLength(59)
        expect(result.current[0]).toEqual(
            expect.objectContaining({
                endDate: '2023-02-28',
                startDate: '2023-02-28',
                id: '20230228',
            })
        )
        expect(result.current[58]).toEqual(
            expect.objectContaining({
                endDate: '2023-01-01',
                startDate: '2023-01-01',
                id: '20230101',
            })
        )
    })

    it('should return a list of weekly periods', () => {
        const periodType = 'WEEKLY'
        const openFuturePeriods = 0
        const year = 2023
        const dateLimit = new Date('2023-03-01')

        const { result } = renderHook(() =>
            usePeriods({
                periodType,
                openFuturePeriods,
                year,
                dateLimit,
            })
        )

        expect(result.current).toHaveLength(9)
        expect(result.current[0]).toEqual(
            expect.objectContaining({
                startDate: '2023-02-20',
                id: '2023W8',
                endDate: '2023-02-26',
            })
        )
        expect(result.current[8]).toEqual(
            expect.objectContaining({
                startDate: '2022-12-26',
                id: '2022W52',
                endDate: '2023-01-01',
            })
        )
    })

    it('should return a list of weekly periods for the previous year', () => {
        const periodType = 'WEEKLY'
        const openFuturePeriods = 0
        const year = 2019
        const dateLimit = new Date('2023-03-01')

        const { result } = renderHook(() =>
            usePeriods({
                periodType,
                openFuturePeriods,
                year,
                dateLimit,
            })
        )

        expect(result.current).toHaveLength(53)
        expect(result.current[0]).toEqual(
            expect.objectContaining({
                startDate: '2019-12-30',
                id: '2020W1',
                endDate: '2020-01-05',
            })
        )
        expect(result.current[52]).toEqual(
            expect.objectContaining({
                startDate: '2018-12-31',
                id: '2019W1',
                endDate: '2019-01-06',
            })
        )
    })

    it('should return a list of monthly periods', () => {
        const periodType = 'MONTHLY'
        const openFuturePeriods = 0
        const year = 2023
        const dateLimit = new Date('2023-07-16')

        const { result } = renderHook(() =>
            usePeriods({
                periodType,
                openFuturePeriods,
                year,
                dateLimit,
            })
        )

        expect(result.current).toHaveLength(6)
        expect(result.current[0]).toEqual(
            expect.objectContaining({
                endDate: '2023-06-30',
                startDate: '2023-06-01',
                id: '202306',
            })
        )
        expect(result.current[5]).toEqual(
            expect.objectContaining({
                endDate: '2023-01-31',
                startDate: '2023-01-01',
                id: '202301',
            })
        )
    })

    it('should return a list of quarterly periods', () => {
        const periodType = 'QUARTERLY'
        const openFuturePeriods = 0
        const year = 2023
        const dateLimit = new Date('2023-08-16')

        const { result } = renderHook(() =>
            usePeriods({
                periodType,
                openFuturePeriods,
                year,
                dateLimit,
            })
        )

        expect(result.current).toHaveLength(2)
        expect(result.current).toEqual([
            expect.objectContaining({
                endDate: '2023-06-30',
                startDate: '2023-04-01',
                id: '2023Q2',
            }),
            expect.objectContaining({
                endDate: '2023-03-31',
                startDate: '2023-01-01',
                id: '2023Q1',
            }),
        ])
    })

    it('should return a list of sixmonthlynovember periods', () => {
        const periodType = 'SIXMONTHLYNOV'
        const openFuturePeriods = 0
        const year = 2023
        const dateLimit = new Date('2023-08-16')

        const { result } = renderHook(() =>
            usePeriods({
                periodType,
                openFuturePeriods,
                year,
                dateLimit,
            })
        )

        expect(result.current).toHaveLength(1)
        expect(result.current).toEqual([
            expect.objectContaining({
                startDate: '2022-11-01',
                endDate: '2023-04-30',
                id: '2022NovemberS1',
            }),
        ])
    })

    it('should return a list of yearly periods', () => {
        const periodType = 'YEARLY'
        const openFuturePeriods = 0
        const year = 2023
        const dateLimit = new Date('2023-08-16')

        const { result } = renderHook(() =>
            usePeriods({
                periodType,
                openFuturePeriods,
                year,
                dateLimit,
            })
        )

        expect(result.current).toHaveLength(53)
        expect(result.current[0]).toEqual(
            expect.objectContaining({
                endDate: '2022-12-31',
                startDate: '2022-01-01',
                id: '2022',
            })
        )
        expect(result.current[52]).toEqual(
            expect.objectContaining({
                endDate: '1970-12-31',
                startDate: '1970-01-01',
                id: '1970',
            })
        )
    })

    it('should return a list of financial november periods', () => {
        const periodType = 'FYNOV'
        const openFuturePeriods = 0
        const year = 2023
        const dateLimit = new Date('2023-08-16')

        const { result } = renderHook(() =>
            usePeriods({
                periodType,
                openFuturePeriods,
                year,
                dateLimit,
            })
        )

        expect(result.current).toHaveLength(52)
        expect(result.current[0]).toEqual(
            expect.objectContaining({
                endDate: '2022-10-31',
                startDate: '2021-11-01',
                id: '2021Nov',
            })
        )
        expect(result.current[51]).toEqual(
            expect.objectContaining({
                endDate: '1971-10-31',
                startDate: '1970-11-01',
                id: '1970Nov',
            })
        )
    })

    it('should return two additional FYAPR periods with openFuturePeriods of 2', () => {
        jest.setSystemTime(new Date('2023-03-01'))

        const { result } = renderHook(() =>
            usePeriods({
                periodType: 'FYAPR',
                openFuturePeriods: 2,
                year: 2023,
                dateLimit: new Date('2024-04-01'),
            })
        )

        expect(result.current).toHaveLength(54)
    })
})
