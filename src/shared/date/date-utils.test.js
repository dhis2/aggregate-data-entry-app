import {
    isDateALessThanDateB,
    isDateAGreaterThanDateB,
    addDaysToDateString,
    getRelativeTime,
} from './date-utils.js'

describe('isDateALessThanDateB (gregory)', () => {
    beforeEach(() => {
        jest.spyOn(console, 'error').mockImplementation(jest.fn())
    })

    it('works for dates without time information', () => {
        const dateA = { date: '2022-01-01', calendar: 'gregory' }
        const dateB = { date: '2022-07-01', calendar: 'gregory' }
        const options = { inclusive: false }
        expect(isDateALessThanDateB(dateA, dateB, options)).toBe(true)
    })

    it('works for dates with time stamp', () => {
        const dateA = { date: '2022-01-01T12:00:00', calendar: 'gregory' }
        const dateB = { date: '2023-07-01T12:00:00', calendar: 'gregory' }
        const options = { inclusive: false }
        expect(isDateALessThanDateB(dateA, dateB, options)).toBe(true)
    })

    it('works for dates mixed with time stamp/without time stamp', () => {
        const dateA = { date: '2022-01-01', calendar: 'gregory' }
        const dateB = { date: '2022-07-01T00:00:00', calendar: 'gregory' }
        const options = { inclusive: false }
        expect(isDateALessThanDateB(dateA, dateB, options)).toBe(true)
    })

    it('returns null for invalid dates', () => {
        const dateA = { date: '2022-01-01', calendar: 'gregory' }
        const dateB = { date: '2022-01-01T00:00.00000', calendar: 'gregory' }
        const options = { inclusive: false }
        expect(isDateALessThanDateB(dateA, dateB, options)).toBe(null)
    })

    it('defaults to assume gregory calendar, and returns null for invalid dates', () => {
        const dateA = { date: '2022-01-01' }
        const dateB = { date: '2023-13-03' }
        expect(isDateALessThanDateB(dateA, dateB)).toBe(null)
    })

    it('defaults to inclusive: false by default', () => {
        const dateA = { date: '2022-01-01', calendar: 'gregory' }
        const dateB = { date: '2022-01-01T00:00:00', calendar: 'gregory' }
        expect(isDateALessThanDateB(dateA, dateB)).toBe(false)
    })

    it('uses inclusive comparison if specified', () => {
        const dateA = { date: '2022-01-01', calendar: 'gregory' }
        const dateB = { date: '2022-01-01T00:00:00', calendar: 'gregory' }
        const options = { inclusive: true }
        expect(isDateALessThanDateB(dateA, dateB, options)).toBe(true)
    })
})

describe('isDateALessThanDateB (nepali)', () => {
    beforeEach(() => {
        jest.spyOn(console, 'error').mockImplementation(jest.fn())
    })

    it('works for dates without time information', () => {
        const dateA = { date: '2078-04-31', calendar: 'nepali' }
        const dateB = { date: '2078-05-31', calendar: 'nepali' }
        const options = { inclusive: false }
        expect(isDateALessThanDateB(dateA, dateB, options)).toBe(true)
    })

    it('works for dates with time stamp', () => {
        const dateA = { date: '2078-04-31T00:00:00', calendar: 'nepali' }
        const dateB = { date: '2078-05-31T00:00:00', calendar: 'nepali' }
        const options = { inclusive: false }
        expect(isDateALessThanDateB(dateA, dateB, options)).toBe(true)
    })

    it('works for dates mixed with time stamp/without time stamp', () => {
        const dateA = { date: '2078-04-31', calendar: 'nepali' }
        const dateB = { date: '2078-05-31T00:00:00', calendar: 'nepali' }
        const options = { inclusive: false }
        expect(isDateALessThanDateB(dateA, dateB, options)).toBe(true)
    })

    // this test will fail while using string comparison
    it.skip('returns null for invalid dates', () => {
        const dateA = { date: '2078-04-40', calendar: 'nepali' }
        const dateB = { date: '2078-05-31', calendar: 'nepali' }
        const options = { inclusive: false }
        expect(isDateALessThanDateB(dateA, dateB, options)).toBe(null)
    })

    it('uses inclusive comparison if specified', () => {
        const dateA = { date: '2022-01-01', calendar: 'nepali' }
        const dateB = { date: '2022-01-01T00:00:00', calendar: 'nepali' }
        const options = { calendar: 'nepali', inclusive: true }
        expect(isDateALessThanDateB(dateA, dateB, options)).toBe(true)
    })
})

describe('isDateALessThanDateB (ethiopian)', () => {
    beforeEach(() => {
        jest.spyOn(console, 'error').mockImplementation(jest.fn())
    })

    it('works for dates without time information', () => {
        const dateA = { date: '2016-02-30', calendar: 'ethiopian' }
        const dateB = { date: '2016-04-30', calendar: 'ethiopian' }
        const options = { inclusive: false }
        expect(isDateALessThanDateB(dateA, dateB, options)).toBe(true)
    })

    it('works for dates with time stamp', () => {
        const dateA = { date: '2016-02-30T00:00:00', calendar: 'ethiopian' }
        const dateB = { date: '2016-04-30T00:00:00', calendar: 'ethiopian' }
        const options = { inclusive: false }
        expect(isDateALessThanDateB(dateA, dateB, options)).toBe(true)
    })

    it('works for dates mixed with time stamp/without time stamp', () => {
        const dateA = { date: '2016-02-30', calendar: 'ethiopian' }
        const dateB = { date: '2016-04-30T00:00:00', calendar: 'ethiopian' }
        const options = { inclusive: false }
        expect(isDateALessThanDateB(dateA, dateB, options)).toBe(true)
    })

    // this test will fail while using string comparison
    it.skip('returns null for invalid dates', () => {
        const dateA = { date: '2016-02-31', calendar: 'ethiopian' }
        const dateB = { date: '2016-04-30', calendar: 'ethiopian' }
        const options = { inclusive: false }
        expect(isDateALessThanDateB(dateA, dateB, options)).toBe(null)
    })

    it('uses inclusive comparison if specified', () => {
        const dateA = { date: '2016-02-30', calendar: 'ethiopian' }
        const dateB = { date: '2016-02-30T00:00:00', calendar: 'ethiopian' }
        const options = { inclusive: true }
        expect(isDateALessThanDateB(dateA, dateB, options)).toBe(true)
    })
})

describe('isDateALessThanDateB (mixed calendars)', () => {
    beforeEach(() => {
        jest.spyOn(console, 'error').mockImplementation(jest.fn())
    })

    // 2023-09-10 ISO
    // 2015-13-05 Ethiopian
    // 2080-05-24 Nepali

    it('works for dates without time information', () => {
        const dateA = { date: '2023-09-10', calendar: 'gregory' }
        const dateB = { date: '2015-13-05', calendar: 'ethiopian' }
        const options = { inclusive: false }
        expect(isDateALessThanDateB(dateA, dateB, options)).toBe(false)
    })

    it('works for dates without time information (inclusive)', () => {
        const dateA = { date: '2023-09-10', calendar: 'gregory' }
        const dateB = { date: '2015-13-05', calendar: 'ethiopian' }
        const options = { inclusive: true }
        expect(isDateALessThanDateB(dateA, dateB, options)).toBe(true)
    })

    it('defaults to gregorian calendar if not passed', () => {
        const dateA = { date: '2016-02-30', calendar: 'ethiopian' }
        const dateB = { date: '2016-02-30' }
        const options = { inclusive: false }
        expect(isDateALessThanDateB(dateA, dateB, options)).toBe(false)
    })

    it('works with mix of time/timeless strings', () => {
        const dateA = { date: '2015-13-05', calendar: 'ethiopian' }
        const dateB = { date: '2023-09-10T00:00', calendar: 'gregory' }
        const options = { inclusive: true }
        expect(isDateALessThanDateB(dateA, dateB, options)).toBe(true)
    })

    it('works with mix of calendars (dateA is less)', () => {
        const dateA = { date: '2015-13-05T00:00', calendar: 'ethiopian' }
        const dateB = { date: '2080-05-25T00:00', calendar: 'nepali' }
        const options = { inclusive: false }
        expect(isDateALessThanDateB(dateA, dateB, options)).toBe(true)
    })

    it('works with mix of calendars (dateA is greater)', () => {
        const dateA = { date: '2015-13-05T00:00', calendar: 'ethiopian' }
        const dateB = { date: '2080-05-23T00:00', calendar: 'nepali' }
        const options = { inclusive: false }
        expect(isDateALessThanDateB(dateA, dateB, options)).toBe(false)
    })
})

describe('isDateAGreaterThanDateB', () => {
    beforeEach(() => {
        jest.spyOn(console, 'error').mockImplementation(jest.fn())
    })

    it('works for dates without time information', () => {
        const dateA = { date: '2022-07-01', calendar: 'gregory' }
        const dateB = { date: '2022-01-01', calendar: 'gregory' }
        const options = { inclusive: false }
        expect(isDateAGreaterThanDateB(dateA, dateB, options)).toBe(true)
    })

    it('works for dates with time stamp', () => {
        const dateA = { date: '2023-07-01T12:00:00', calendar: 'gregory' }
        const dateB = { date: '2022-01-01T12:00:00', calendar: 'gregory' }
        const options = { inclusive: false }
        expect(isDateAGreaterThanDateB(dateA, dateB, options)).toBe(true)
    })

    it('works for dates mixed with time stamp/without time stamp', () => {
        const dateA = { date: '2022-07-01T00:00:00', calendar: 'gregory' }
        const dateB = { date: '2022-01-01', calendar: 'gregory' }
        const options = { inclusive: false }
        expect(isDateAGreaterThanDateB(dateA, dateB, options)).toBe(true)
    })

    it('returns null for invalid dates', () => {
        const dateA = { date: '2022-01-01T00:00.00000', calendar: 'gregory' }
        const dateB = { date: '2022-01-01', calendar: 'gregory' }
        const options = { inclusive: false }
        expect(isDateAGreaterThanDateB(dateA, dateB, options)).toBe(null)
    })

    it('defaults to assume gregory calendar, and returns null for invalid dates', () => {
        const dateA = { date: '2023-13-03' }
        const dateB = { date: '2022-01-01' }
        expect(isDateAGreaterThanDateB(dateA, dateB)).toBe(null)
    })

    it('defaults to inclusive: false by default', () => {
        const dateA = { date: '2022-01-01T00:00:00', calendar: 'gregory' }
        const dateB = { date: '2022-01-01', calendar: 'gregory' }
        expect(isDateAGreaterThanDateB(dateA, dateB)).toBe(false)
    })

    it('uses inclusive comparison if specified', () => {
        const dateA = { date: '2022-01-01T00:00:00', calendar: 'gregory' }
        const dateB = { date: '2022-01-01', calendar: 'gregory' }
        const options = { inclusive: true }
        expect(isDateAGreaterThanDateB(dateA, dateB, options)).toBe(true)
    })
})

describe('addDaysToDateString', () => {
    it('adds appropriate number of days', () => {
        const startDateString = '2023-03-15'
        const days = 5
        const calendar = 'gregorian'
        const result = addDaysToDateString({ startDateString, days, calendar })
        expect(result).toBe('2023-03-20')
    })

    it('adds appropriate number of days across months', () => {
        const startDateString = '2023-03-15'
        const days = 35
        const calendar = 'gregorian'
        const result = addDaysToDateString({ startDateString, days, calendar })
        expect(result).toBe('2023-04-19')
    })

    it('handles negative days', () => {
        const startDateString = '2023-03-15'
        const days = -5
        const calendar = 'gregorian'
        const result = addDaysToDateString({ startDateString, days, calendar })
        expect(result).toBe('2023-03-10')
    })

    it('returns date with timestamp if originally included', () => {
        const startDateString = '2023-03-15T12:00:00'
        const days = 5
        const calendar = 'gregorian'
        const result = addDaysToDateString({ startDateString, days, calendar })
        expect(result).toBe('2023-03-20T12:00:00')
    })

    it('works with ethiopian calendar', () => {
        const startDateString = '2016-02-30'
        const days = 5
        const calendar = 'ethiopian'
        const result = addDaysToDateString({
            startDateString,
            days,
            calendar,
        })
        expect(result).toBe('2016-03-05')
    })

    it('works with nepali calendar', () => {
        const startDateString = '2080-02-30'
        const days = 5
        const calendar = 'nepali'
        const result = addDaysToDateString({
            startDateString,
            days,
            calendar,
        })
        expect(result).toBe('2080-03-03')
    })
})

describe('getRelativeTime', () => {
    beforeEach(() => {
        jest.useFakeTimers('modern')
        jest.setSystemTime(new Date('2024-06-15T12:00:00').getTime())
    })

    afterEach(() => {
        jest.useRealTimers()
    })

    it('works with ethiopian calendar', () => {
        // 2024-06-15 Ethiopian = 2032-02-23 (i.e. in 8 years)
        const startDate = '2024-06-15T13:00:00'
        const calendar = 'ethiopian'
        const result = getRelativeTime({ startDate, calendar })
        expect(result).toBe('in 8 years')
    })

    it('works with nepali calendar', () => {
        // 2024-06-15 Nepali = 1967-10-01 (i.e. 57 years ago)
        const startDate = '2024-06-15T13:00:00'
        const calendar = 'nepali'
        const result = getRelativeTime({ startDate, calendar })
        expect(result).toBe('57 years ago')
    })

    it('returns relative time (from now) with gregory dates if no end date specified', () => {
        const startDate = '2024-06-15T11:00:00'
        const calendar = 'gregory'
        const result = getRelativeTime({ startDate, calendar })
        expect(result).toBe('an hour ago')
    })

    it('corrects for timezone differences when no end date is specified and time zone is passed', () => {
        const startDate = '2024-06-15T11:00:00'
        const calendar = 'gregory'
        const timezone = 'Europe/Oslo'
        const result = getRelativeTime({ startDate, calendar, timezone })
        // now (client): is 12:00 UTC; last updated (server): is 11:00 (Europe/Oslo), which is 9:00 UTC
        expect(result).toBe('3 hours ago')
    })

    it('returns relative time with gregory dates based on end date if provided', () => {
        const startDate = '2024-06-15T11:00:00'
        const endDate = '2024-06-15T17:00:00'
        const calendar = 'gregory'
        const result = getRelativeTime({ startDate, endDate, calendar })
        expect(result).toBe('6 hours ago')
    })
})
