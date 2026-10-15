// Regression snapshots for the date helpers that build calendar date strings.
// They were added to verify the switch to multi-calendar-dates' date helpers
// (formatCalendarDate / addToCalendarDate) and can be deleted afterwards.
import {
    addDaysToDateString,
    convertFromIso8601ToString,
} from './date-utils.js'
import { getNowInCalendarString } from './get-now-in-calendar.js'

const CALENDARS = ['gregory', 'ethiopian', 'ethiopic', 'nepali', 'islamic']

const run = (fn) => {
    try {
        return fn()
    } catch (e) {
        return `Error: ${e.message}`
    }
}

describe('getNowInCalendarString (regression)', () => {
    const NOW = [
        '2024-06-15T12:34:56Z',
        '2023-09-12T00:00:00Z', // Ethiopian new year (2016-01-01)
        '2023-09-11T23:59:59Z', // Ethiopian 13th month (2015-13-06)
        '2024-02-29T08:05:09Z',
        '2024-04-13T18:00:00Z', // Nepali new year (2081-01-01)
    ]

    afterEach(() => {
        jest.useRealTimers()
    })

    it.each(CALENDARS)('%s', (calendar) => {
        const results = {}
        NOW.forEach((now) => {
            jest.useFakeTimers('modern')
            jest.setSystemTime(new Date(now).getTime())
            results[now] = {
                short: run(() => getNowInCalendarString({ calendar })),
                long: run(() =>
                    getNowInCalendarString({ calendar, long: true })
                ),
                kigali: run(() =>
                    getNowInCalendarString({
                        calendar,
                        timezone: 'Africa/Kigali',
                        long: true,
                    })
                ),
            }
        })
        expect(results).toMatchSnapshot()
    })
})

describe('convertFromIso8601ToString (regression)', () => {
    const DATES = [
        '2024-06-15',
        '2024-06-15T12:34:56',
        '2024-06-15T12:34:56.789',
        '2023-09-11',
        '2023-09-12',
        '2024-02-29',
        '2024-04-13',
        '1999-12-31',
        '2030-01-01T00:00:00',
        '0700-06-15', // Islamic year below 1000, to check the padding
    ]

    it.each([...CALENDARS, 'iso8601', 'gregorian'])('%s', (calendar) => {
        const results = {}
        DATES.forEach((date) => {
            results[date] = run(() =>
                convertFromIso8601ToString(date, calendar)
            )
        })
        results.undefined = run(() =>
            convertFromIso8601ToString(undefined, calendar)
        )
        expect(results).toMatchSnapshot()
    })
})

describe('addDaysToDateString (regression)', () => {
    const CASES = {
        gregory: ['2023-03-15', '2024-02-28', '2023-12-31T12:00:00'],
        ethiopian: [
            '2016-02-30',
            '2016-12-28',
            '2015-13-06',
            '2016-13-05',
            '2016-12-30T12:00:00',
        ],
        ethiopic: ['7516-02-30', '7516-13-05', '2016-02-30'],
        nepali: [
            '2080-02-30',
            '2081-03-31',
            '2080-12-30',
            '2081-01-01T12:00:00',
        ],
        islamic: ['1445-12-28', '1446-01-01', '1445-09-29T12:00:00'],
    }
    const DAYS = [1, 5, 35, -5, -40]

    it.each(CALENDARS)('%s', (calendar) => {
        const results = {}
        CASES[calendar].forEach((startDateString) => {
            DAYS.forEach((days) => {
                results[`${startDateString} ${days > 0 ? '+' : ''}${days}`] =
                    run(() =>
                        addDaysToDateString({
                            startDateString,
                            days,
                            calendar,
                        })
                    )
            })
        })
        expect(results).toMatchSnapshot()
    })
})
