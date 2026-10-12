// Regression coverage for every direct usage of @dhis2/multi-calendar-dates
// in this app, across the most behaviourally distinct calendars. The
// snapshots were taken before bumping the library to 3.x and must stay
// unchanged across library upgrades unless a change is deliberate.
import {
    createFixedPeriodFromPeriodId,
    generateFixedPeriods,
    getAdjacentFixedPeriods,
    getFixedPeriodByDate,
    getNowInCalendar,
    periodTypes,
} from '@dhis2/multi-calendar-dates'
import { computePeriodDateLimit } from '../context-selection/period-selector-bar-item/use-date-limit.js'
import {
    convertFromIso8601ToString,
    convertToIso8601ToString,
    getRelativeTime,
} from './date/date-utils.js'
import { getNowInCalendarString } from './date/get-now-in-calendar.js'

const CALENDARS = {
    gregory: {
        year: 2024,
        date: '2024-06-15',
        periodIds: [
            '20240615',
            '2024W24',
            '2024BiW12',
            '202406',
            '2024Q2',
            '2024S1',
            '2024',
            '2024July',
        ],
    },
    ethiopian: {
        year: 2016,
        date: '2016-10-08',
        periodIds: [
            '20161008',
            '2016W40',
            '201610',
            '2016Q4',
            '2016S2',
            '2016',
            '2016July',
        ],
    },
    nepali: {
        year: 2081,
        date: '2081-03-01',
        periodIds: [
            '20810301',
            '2081W12',
            '208103',
            '2081Q1',
            '2081S1',
            '2081',
            '2081July',
        ],
    },
}

const PERIOD_TYPES = [
    'DAILY',
    'WEEKLY',
    'WEEKLYWED',
    'BIWEEKLY',
    'MONTHLY',
    'BIMONTHLY',
    'QUARTERLY',
    'SIXMONTHLY',
    'YEARLY',
    'FYJUL',
]

// Daily periods produce hundreds of entries; keep the snapshot readable
const summarise = (periods) =>
    periods.length > 60
        ? {
              length: periods.length,
              first: periods.slice(0, 3),
              last: periods.slice(-3),
          }
        : periods

// Record errors as values so a call that throws is part of the baseline too
const capture = (fn) => {
    try {
        return fn()
    } catch (e) {
        return `throws ${e.name}: ${e.message}`
    }
}

beforeAll(() => {
    jest.useFakeTimers('modern')
    jest.setSystemTime(new Date('2024-06-15T10:30:45Z').getTime())
})

afterAll(() => {
    jest.useRealTimers()
})

it('exposes the expected period types', () => {
    expect(periodTypes).toMatchSnapshot()
})

describe.each(Object.keys(CALENDARS))('%s calendar', (calendar) => {
    const { year, date, periodIds } = CALENDARS[calendar]

    it('getNowInCalendarString (short and long, several time zones)', () => {
        const result = ['Etc/UTC', 'Africa/Kigali', 'America/New_York'].map(
            (timezone) => ({
                timezone,
                short: capture(() =>
                    getNowInCalendarString({ calendar, timezone })
                ),
                long: capture(() =>
                    getNowInCalendarString({ calendar, timezone, long: true })
                ),
            })
        )
        expect(result).toMatchSnapshot()
    })

    it('getNowInCalendar (fields read by the period selector)', () => {
        expect(
            capture(() => {
                const { year, eraYear } = getNowInCalendar(calendar)
                return { year, eraYear }
            })
        ).toMatchSnapshot()
    })

    it('convertFromIso8601ToString / convertToIso8601ToString', () => {
        expect({
            fromIso: capture(() =>
                convertFromIso8601ToString('2024-06-15', calendar)
            ),
            fromIsoLong: capture(() =>
                convertFromIso8601ToString('2024-06-15T10:30:00', calendar)
            ),
            toIso: capture(() => convertToIso8601ToString(date, calendar)),
            toIsoLong: capture(() =>
                convertToIso8601ToString(`${date}T10:30:00`, calendar)
            ),
        }).toMatchSnapshot()
    })

    it('getRelativeTime', () => {
        expect(
            capture(() =>
                getRelativeTime({
                    startDate: date,
                    calendar,
                    timezone: 'Etc/UTC',
                })
            )
        ).toMatchSnapshot()
    })

    it.each(PERIOD_TYPES)('generateFixedPeriods (%s)', (periodType) => {
        const payload = {
            calendar,
            periodType,
            year,
            locale: 'en',
            yearsCount: 3,
        }
        expect({
            thisYear: capture(() => summarise(generateFixedPeriods(payload))),
            endsBefore: capture(() =>
                summarise(
                    generateFixedPeriods({ ...payload, endsBefore: date })
                )
            ),
        }).toMatchSnapshot()
    })

    it.each(PERIOD_TYPES)(
        'getFixedPeriodByDate / getAdjacentFixedPeriods (%s)',
        (periodType) => {
            const period = capture(() =>
                getFixedPeriodByDate({ periodType, date, calendar })
            )
            expect({
                period,
                next: capture(() =>
                    getAdjacentFixedPeriods({ period, calendar, steps: 2 })
                ),
                previous: capture(() =>
                    getAdjacentFixedPeriods({ period, calendar, steps: -2 })
                ),
            }).toMatchSnapshot()
        }
    )

    it.each(PERIOD_TYPES)('computePeriodDateLimit (%s)', (periodType) => {
        expect(
            [0, 1, 3].map((openFuturePeriods) =>
                capture(() =>
                    computePeriodDateLimit({
                        periodType,
                        dateServerInCalendarString: date,
                        openFuturePeriods,
                        calendar,
                    })
                )
            )
        ).toMatchSnapshot()
    })

    it('createFixedPeriodFromPeriodId', () => {
        const result = Object.fromEntries(
            periodIds.map((periodId) => [
                periodId,
                capture(() =>
                    createFixedPeriodFromPeriodId({ periodId, calendar })
                ),
            ])
        )
        expect(result).toMatchSnapshot()
    })
})
