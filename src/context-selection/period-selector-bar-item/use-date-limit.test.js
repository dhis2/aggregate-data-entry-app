import { useConfig } from '@dhis2/app-runtime'
import { renderHook } from '@testing-library/react'
import * as getNowInCalendarFunctions from '../../shared/date/get-now-in-calendar.js'
import {
    periodTypes,
    useMetadata,
    periodTypesMapping,
} from '../../shared/index.js'
import { useDateLimit, computePeriodDateLimit } from './use-date-limit.js'

export const reversedPeriodTypesMapping = Object.fromEntries(
    Object.entries(periodTypesMapping).map(([key, value]) => [value, key])
)

jest.mock('@dhis2/app-runtime', () => ({
    ...jest.requireActual('@dhis2/app-runtime'),
    useConfig: jest.fn(() => ({
        systemInfo: { serverTimeZoneId: 'Etc/UTC', calendar: 'gregory' },
    })),
}))

jest.mock(
    '../../shared/use-context-selection/use-context-selection.js',
    () => ({
        useDataSetId: jest.fn(() => ['dataSetId']),
    })
)

jest.mock('../../shared/metadata/use-metadata.js', () => ({
    useMetadata: jest.fn(() => ({
        data: {
            dataSets: {
                dataSetId: {
                    id: 'dataSetId',
                    periodType: 'Monthly',
                    openFuturePeriods: 0,
                },
            },
        },
    })),
}))

describe('computePeriodDateLimit', () => {
    it('it should return the "2022-04-01" date', () => {
        const currentDate = '2023-03-01'

        const actual = computePeriodDateLimit({
            periodType: periodTypes.FYAPR,
            dateServerInCalendarString: currentDate,
            openFuturePeriods: 0,
        })
        const expected = '2022-04-01'

        expect(actual).toEqual(expected)
    })

    it('it should return the "2023-04-01" period', () => {
        const currentDate = '2023-05-01'

        const actual = computePeriodDateLimit({
            periodType: periodTypes.FYAPR,
            dateServerInCalendarString: currentDate,
            openFuturePeriods: 0,
        })
        const expected = '2023-04-01'

        expect(actual).toEqual(expected)
    })
})

/**
 * Should add future periods, even when spanning over several years
 * Table data: [expectedDate, currentDate, periodType, openFuturePeriods]
 */
describe.each([
    [
        '2023-01-01' /* Sunday */,
        reversedPeriodTypesMapping.DAILY,
        0,
        '2023-01-01',
    ],
    [
        '2023-01-01' /* Sunday */,
        reversedPeriodTypesMapping.DAILY,
        2,
        '2023-01-03',
    ],

    [
        '2023-01-01' /* Sunday */,
        reversedPeriodTypesMapping.WEEKLY,
        0,
        '2022-12-26',
    ],
    [
        '2023-01-02' /* Monday */,
        reversedPeriodTypesMapping.WEEKLY,
        0,
        '2023-01-02',
    ],
    [
        '2023-01-01' /* Sunday */,
        reversedPeriodTypesMapping.WEEKLY,
        2,
        '2023-01-09',
    ],
    [
        '2023-01-02' /* Monday */,
        reversedPeriodTypesMapping.WEEKLY,
        2,
        '2023-01-16',
    ],

    [
        '2023-01-01' /* Sunday */,
        reversedPeriodTypesMapping.WEEKLYWED,
        0,
        '2022-12-28',
    ],
    [
        '2023-01-04' /* Wednesday */,
        reversedPeriodTypesMapping.WEEKLYWED,
        0,
        '2023-01-04',
    ],
    [
        '2023-01-01' /* Sunday */,
        reversedPeriodTypesMapping.WEEKLYWED,
        2,
        '2023-01-11',
    ],
    [
        '2023-01-04' /* Wednesday */,
        reversedPeriodTypesMapping.WEEKLYWED,
        2,
        '2023-01-18',
    ],

    [
        '2023-01-01' /* Sunday */,
        reversedPeriodTypesMapping.WEEKLYTHU,
        0,
        '2022-12-29',
    ],
    [
        '2023-01-05' /* Thursday */,
        reversedPeriodTypesMapping.WEEKLYTHU,
        0,
        '2023-01-05',
    ],
    [
        '2023-01-01' /* Sunday */,
        reversedPeriodTypesMapping.WEEKLYTHU,
        2,
        '2023-01-12',
    ],
    [
        '2023-01-05' /* Thursday */,
        reversedPeriodTypesMapping.WEEKLYTHU,
        2,
        '2023-01-19',
    ],

    [
        '2023-01-01' /* Sunday */,
        reversedPeriodTypesMapping.WEEKLYSAT,
        0,
        '2022-12-31',
    ],
    [
        '2023-01-08' /* Saturday */,
        reversedPeriodTypesMapping.WEEKLYSAT,
        0,
        '2023-01-07',
    ],
    [
        '2023-01-01' /* Sunday */,
        reversedPeriodTypesMapping.WEEKLYSAT,
        2,
        '2023-01-14',
    ],
    [
        '2023-01-08' /* Saturday */,
        reversedPeriodTypesMapping.WEEKLYSAT,
        2,
        '2023-01-21',
    ],

    [
        '2022-01-01' /* Saturday */,
        reversedPeriodTypesMapping.WEEKLYSUN,
        0,
        '2021-12-26',
    ],
    [
        '2022-01-02' /* Sunday */,
        reversedPeriodTypesMapping.WEEKLYSUN,
        0,
        '2022-01-02',
    ],
    [
        '2022-01-01' /* Saturday */,
        reversedPeriodTypesMapping.WEEKLYSUN,
        2,
        '2022-01-09',
    ],
    [
        '2022-01-02' /* Sunday */,
        reversedPeriodTypesMapping.WEEKLYSUN,
        2,
        '2022-01-16',
    ],

    [
        '2023-01-01' /* Sunday */,
        reversedPeriodTypesMapping.BIWEEKLY,
        0,
        '2022-12-19',
    ],
    [
        '2023-01-02' /* Monday */,
        reversedPeriodTypesMapping.BIWEEKLY,
        0,
        '2023-01-02',
    ],
    [
        '2023-01-01' /* Sunday */,
        reversedPeriodTypesMapping.BIWEEKLY,
        2,
        '2023-01-16',
    ],
    [
        '2023-01-02' /* Monday */,
        reversedPeriodTypesMapping.BIWEEKLY,
        2,
        '2023-01-30',
    ],

    ['2023-01-01', reversedPeriodTypesMapping.MONTHLY, 0, '2023-01-01'],
    ['2023-01-01', reversedPeriodTypesMapping.MONTHLY, 2, '2023-03-01'],

    ['2023-01-01', reversedPeriodTypesMapping.BIMONTHLY, 0, '2023-01-01'],
    ['2023-02-01', reversedPeriodTypesMapping.BIMONTHLY, 0, '2023-01-01'],
    ['2023-01-01', reversedPeriodTypesMapping.BIMONTHLY, 2, '2023-05-01'],
    ['2023-02-01', reversedPeriodTypesMapping.BIMONTHLY, 2, '2023-05-01'],

    ['2023-01-01', reversedPeriodTypesMapping.QUARTERLY, 0, '2023-01-01'],
    ['2023-02-28', reversedPeriodTypesMapping.QUARTERLY, 0, '2023-01-01'],
    ['2023-01-01', reversedPeriodTypesMapping.QUARTERLY, 2, '2023-07-01'],
    ['2023-02-28', reversedPeriodTypesMapping.QUARTERLY, 2, '2023-07-01'],

    ['2023-01-01', reversedPeriodTypesMapping.QUARTERLYNOV, 0, '2022-11-01'],
    ['2023-02-01', reversedPeriodTypesMapping.QUARTERLYNOV, 0, '2023-02-01'],
    ['2023-01-01', reversedPeriodTypesMapping.QUARTERLYNOV, 2, '2023-05-01'],
    ['2023-02-01', reversedPeriodTypesMapping.QUARTERLYNOV, 2, '2023-08-01'],

    ['2023-01-01', reversedPeriodTypesMapping.SIXMONTHLY, 0, '2023-01-01'],
    ['2023-06-30', reversedPeriodTypesMapping.SIXMONTHLY, 0, '2023-01-01'],
    ['2023-01-01', reversedPeriodTypesMapping.SIXMONTHLY, 2, '2024-01-01'],
    ['2023-06-30', reversedPeriodTypesMapping.SIXMONTHLY, 2, '2024-01-01'],

    ['2023-01-01', reversedPeriodTypesMapping.SIXMONTHLYAPR, 0, '2022-10-01'],
    ['2023-04-01', reversedPeriodTypesMapping.SIXMONTHLYAPR, 0, '2023-04-01'],
    ['2023-01-01', reversedPeriodTypesMapping.SIXMONTHLYAPR, 2, '2023-10-01'],
    ['2023-04-01', reversedPeriodTypesMapping.SIXMONTHLYAPR, 2, '2024-04-01'],

    ['2023-01-01', reversedPeriodTypesMapping.SIXMONTHLYNOV, 0, '2022-11-01'],
    ['2023-05-01', reversedPeriodTypesMapping.SIXMONTHLYNOV, 0, '2023-05-01'],
    ['2023-11-01', reversedPeriodTypesMapping.SIXMONTHLYNOV, 0, '2023-11-01'],
    ['2023-01-01', reversedPeriodTypesMapping.SIXMONTHLYNOV, 2, '2023-11-01'],
    ['2023-05-01', reversedPeriodTypesMapping.SIXMONTHLYNOV, 2, '2024-05-01'],
    ['2023-11-01', reversedPeriodTypesMapping.SIXMONTHLYNOV, 2, '2024-11-01'],

    ['2023-01-01', reversedPeriodTypesMapping.YEARLY, 0, '2023-01-01'],
    ['2023-12-31', reversedPeriodTypesMapping.YEARLY, 0, '2023-01-01'],
    ['2023-01-01', reversedPeriodTypesMapping.YEARLY, 2, '2025-01-01'],
    ['2023-12-31', reversedPeriodTypesMapping.YEARLY, 2, '2025-01-01'],

    ['2023-01-01', reversedPeriodTypesMapping.FYAPR, 0, '2022-04-01'],
    ['2023-04-01', reversedPeriodTypesMapping.FYAPR, 0, '2023-04-01'],
    ['2023-01-01', reversedPeriodTypesMapping.FYAPR, 2, '2024-04-01'],
    ['2023-04-01', reversedPeriodTypesMapping.FYAPR, 2, '2025-04-01'],

    ['2023-01-01', reversedPeriodTypesMapping.FYJUL, 0, '2022-07-01'],
    ['2023-07-01', reversedPeriodTypesMapping.FYJUL, 0, '2023-07-01'],
    ['2023-01-01', reversedPeriodTypesMapping.FYJUL, 2, '2024-07-01'],
    ['2023-07-01', reversedPeriodTypesMapping.FYJUL, 2, '2025-07-01'],

    ['2023-01-01', reversedPeriodTypesMapping.FYOCT, 0, '2022-10-01'],
    ['2023-10-01', reversedPeriodTypesMapping.FYOCT, 0, '2023-10-01'],
    ['2023-01-01', reversedPeriodTypesMapping.FYOCT, 2, '2024-10-01'],
    ['2023-10-01', reversedPeriodTypesMapping.FYOCT, 2, '2025-10-01'],

    ['2023-01-01', reversedPeriodTypesMapping.FYNOV, 0, '2022-11-01'],
    ['2023-11-01', reversedPeriodTypesMapping.FYNOV, 0, '2023-11-01'],
    ['2023-01-01', reversedPeriodTypesMapping.FYNOV, 2, '2024-11-01'],
    ['2023-11-01', reversedPeriodTypesMapping.FYNOV, 2, '2025-11-01'],
])(
    'useDateLimit',
    // eslint-disable-next-line max-params
    (currentDate, periodType, openFuturePeriods, expectedDate) => {
        afterEach(() => {
            jest.useRealTimers()
        })
        test(`should be ${expectedDate} if current date: ${currentDate}, periodType: ${periodType}, openFuturePeriods: ${openFuturePeriods}`, () => {
            jest.useFakeTimers('modern')
            // we can set the system time this way because our "browser" time zone is set to UTC
            jest.setSystemTime(new Date(currentDate))
            useMetadata.mockImplementationOnce(() => ({
                data: {
                    dataSets: {
                        dataSetId: {
                            id: 'dataSetId',
                            periodType,
                            openFuturePeriods,
                        },
                    },
                },
            }))

            const { result } = renderHook(() => useDateLimit())
            expect(result.current).toEqual(expectedDate)
        })
    }
)

describe('useDateLimit (time zones)', () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })
    afterEach(() => {
        jest.useRealTimers()
        jest.clearAllMocks()
    })

    it('corrects for timezone discrepancy (earlier time zone)', () => {
        jest.useFakeTimers('modern')
        jest.setSystemTime(new Date('2024-06-01'))
        useConfig.mockImplementation(() => ({
            systemInfo: {
                serverTimeZoneId: 'America/Santiago',
                calendar: 'gregory',
            },
        }))
        // browser time is UTC, but time zone is earlier, so we should get 1 day earlier as the boundary
        useMetadata.mockImplementationOnce(() => ({
            data: {
                dataSets: {
                    dataSetId: {
                        id: 'dataSetId',
                        periodType: reversedPeriodTypesMapping.DAILY,
                        openFuturePeriods: 0,
                    },
                },
            },
        }))

        const { result } = renderHook(() => useDateLimit())
        expect(result.current).toEqual('2024-05-31')
    })

    it('corrects for timezone discrepancy (later time zone)', () => {
        jest.useFakeTimers('modern')
        jest.setSystemTime(new Date('2024-06-01T22:00:00'))
        useConfig.mockImplementation(() => ({
            systemInfo: {
                serverTimeZoneId: 'Asia/Vientiane',
                calendar: 'gregory',
            },
        }))
        // browser time is UTC, but time zone is later, so we get 1 day later as the boundary (since we are at 23:00 UTC)
        useMetadata.mockImplementationOnce(() => ({
            data: {
                dataSets: {
                    dataSetId: {
                        id: 'dataSetId',
                        periodType: reversedPeriodTypesMapping.DAILY,
                        openFuturePeriods: 0,
                    },
                },
            },
        }))

        const { result } = renderHook(() => useDateLimit())
        expect(result.current).toEqual('2024-06-02')
    })
})

describe.each([
    ['2017-13-03', reversedPeriodTypesMapping.DAILY, 0, '2017-13-03'],
    ['2017-02-30', reversedPeriodTypesMapping.DAILY, 0, '2017-02-30'],
    ['2017-02-30', reversedPeriodTypesMapping.WEEKLY, 0, '2017-02-26'],
    ['2017-13-02', reversedPeriodTypesMapping.WEEKLY, 0, '2017-12-27'],
    ['2017-01-01', reversedPeriodTypesMapping.MONTHLY, 0, '2017-01-01'],
    ['2017-02-30', reversedPeriodTypesMapping.MONTHLY, 0, '2017-02-01'],
    ['2017-13-03', reversedPeriodTypesMapping.DAILY, 4, '2018-01-02'],
    ['2017-02-30', reversedPeriodTypesMapping.DAILY, 10, '2017-03-10'],
    ['2017-02-30', reversedPeriodTypesMapping.WEEKLY, 3, '2017-03-17'],
    ['2017-13-02', reversedPeriodTypesMapping.WEEKLY, 13, '2018-03-23'],
    ['2017-01-01', reversedPeriodTypesMapping.MONTHLY, 5, '2017-06-01'],
    ['2017-02-30', reversedPeriodTypesMapping.MONTHLY, 15, '2018-05-01'],
])(
    'useDateLimit (ethiopian calendar)',
    // eslint-disable-next-line max-params
    (currentDate, periodType, openFuturePeriods, expectedDate) => {
        beforeEach(() => {
            useConfig.mockImplementation(() => ({
                systemInfo: { calendar: 'ethiopian', timeZone: 'Etc/UTC' },
            }))
        })

        afterEach(() => {
            jest.clearAllMocks()
        })

        it(`should be ${expectedDate} if current date: ${currentDate}, periodType: ${periodType}, openFuturePeriods: ${openFuturePeriods}`, () => {
            jest.spyOn(
                getNowInCalendarFunctions,
                'getNowInCalendarString'
            ).mockImplementation(() => currentDate)
            useMetadata.mockImplementationOnce(() => ({
                data: {
                    dataSets: {
                        dataSetId: {
                            id: 'dataSetId',
                            periodType,
                            openFuturePeriods,
                        },
                    },
                },
            }))

            const { result } = renderHook(() => useDateLimit())
            expect(result.current).toEqual(expectedDate)
        })
    }
)

describe.each([
    ['2076-04-32', reversedPeriodTypesMapping.DAILY, 0, '2076-04-32'],
    ['2076-02-30', reversedPeriodTypesMapping.DAILY, 0, '2076-02-30'],
    ['2076-02-30', reversedPeriodTypesMapping.WEEKLY, 0, '2076-02-27'],
    ['2076-12-02', reversedPeriodTypesMapping.WEEKLY, 0, '2076-11-26'],
    ['2076-01-01', reversedPeriodTypesMapping.MONTHLY, 0, '2076-01-01'],
    ['2076-02-30', reversedPeriodTypesMapping.MONTHLY, 0, '2076-02-01'],
    ['2076-04-32', reversedPeriodTypesMapping.DAILY, 4, '2076-05-04'],
    ['2076-02-30', reversedPeriodTypesMapping.DAILY, 10, '2076-03-08'],
    ['2076-02-30', reversedPeriodTypesMapping.WEEKLY, 3, '2076-03-16'],
    ['2076-12-02', reversedPeriodTypesMapping.WEEKLY, 13, '2077-02-26'],
    ['2076-01-01', reversedPeriodTypesMapping.MONTHLY, 5, '2076-06-01'],
    ['2076-02-30', reversedPeriodTypesMapping.MONTHLY, 15, '2077-05-01'],
])(
    'useDateLimit (nepali calendar)',
    // eslint-disable-next-line max-params
    (currentDate, periodType, openFuturePeriods, expectedDate) => {
        beforeEach(() => {
            useConfig.mockImplementation(() => ({
                systemInfo: { calendar: 'nepali', timeZone: 'Etc/UTC' },
            }))
        })

        afterEach(() => {
            jest.clearAllMocks()
        })

        it(`should be ${expectedDate} if current date: ${currentDate}, periodType: ${periodType}, openFuturePeriods: ${openFuturePeriods}`, () => {
            jest.spyOn(
                getNowInCalendarFunctions,
                'getNowInCalendarString'
            ).mockImplementation(() => currentDate)
            useMetadata.mockImplementationOnce(() => ({
                data: {
                    dataSets: {
                        dataSetId: {
                            id: 'dataSetId',
                            periodType,
                            openFuturePeriods,
                        },
                    },
                },
            }))

            const { result } = renderHook(() => useDateLimit())
            expect(result.current).toEqual(expectedDate)
        })
    }
)
