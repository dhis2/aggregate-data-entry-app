import { renderHook } from '@testing-library/react-hooks'
import { getNowInCalendarString } from '../../shared/fixed-periods/get-now-in-calendar.js'
import {
    periodTypes,
    useMetadata,
    periodTypesMapping,
} from '../../shared/index.js'
import { useDateLimit, computePeriodDateLimit } from './use-date-limit.js'

export const reversedPeriodTypesMapping = Object.fromEntries(
    Object.entries(periodTypesMapping).map(([key, value]) => [value, key])
)

jest.mock('../../shared/fixed-periods/get-now-in-calendar.js', () => ({
    getNowInCalendarString: jest.fn(() => '2020-07-01'),
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

jest.mock('../../shared/fixed-periods/get-current-date.js', () => ({
    __esModule: true,
    default: jest.fn(() => new Date()),
}))

jest.mock('../../shared/date/use-server-time-offset.js', () => ({
    __esModule: true,
    default: jest.fn(() => 0),
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
        test(`should be ${expectedDate} if current date: ${currentDate}, periodType: ${periodType}, openFuturePeriods: ${openFuturePeriods}`, () => {
            getNowInCalendarString.mockImplementation(() => currentDate)
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
