import { renderHook } from '@testing-library/react-hooks'
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

    it('should return 54 financial year periods for FINANCIAL_APRIL on 2023-03-01', () => {
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

    it('should return 55 financial year periods for FINANCIAL_APRIL on 2023-04-01', () => {
        jest.setSystemTime(new Date('2023-04-01'))

        const { result } = renderHook(() =>
            usePeriods({
                periodType: 'FYAPR',
                openFuturePeriods: 2,
                year: 2023,
                dateLimit: new Date('2025-04-01'),
            })
        )

        const first = result.current[0]
        const last = result.current[result.current.length - 1]
        expect(result.current.length).toBe(55)
        expect(first).toEqual({
            periodType: 'FYAPR',
            name: 'April 2024 - March 2025',
            displayName: 'April 2024 - March 2025',
            id: '2024April',
            iso: '2024April',
            startDate: '2024-04-01',
            endDate: '2025-03-31',
        })
        expect(last).toEqual({
            periodType: 'FYAPR',
            name: 'April 1970 - March 1971',
            displayName: 'April 1970 - March 1971',
            id: '1970April',
            iso: '1970April',
            startDate: '1970-04-01',
            endDate: '1971-03-31',
        })
    })

    it('should return the first two weeks of 2023', () => {
        jest.setSystemTime(new Date('2023-01-19')) // Thursday

        const { result } = renderHook(() =>
            usePeriods({
                periodType: 'WEEKLYWED',
                openFuturePeriods: 0,
                year: 2023,
                dateLimit: new Date('2023-01-18'),
            })
        )

        expect(result.current).toHaveLength(2)
    })

    it('should return the last week of 2021 and all weeks of 2022 but the last one', () => {
        jest.setSystemTime(new Date('2023-01-19')) // Thursday

        const { result } = renderHook(() =>
            usePeriods({
                periodType: 'WEEKLYWED',
                openFuturePeriods: 0,
                year: 2022,
                dateLimit: new Date('2023-01-18'),
            })
        )

        expect(result.current.length).toBe(53)
    })
})
