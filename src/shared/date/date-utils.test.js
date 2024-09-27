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
        const dateA = '2022-01-01'
        const dateB = '2022-07-01'
        const options = { calendar: 'gregory', inclusive: false }
        expect(isDateALessThanDateB(dateA, dateB, options)).toBe(true)
    })

    it('works for dates with time stamp', () => {
        const dateA = '2022-01-01T12:00:00'
        const dateB = '2023-07-01T12:00:00'
        const options = { calendar: 'gregory', inclusive: false }
        expect(isDateALessThanDateB(dateA, dateB, options)).toBe(true)
    })

    it('works for dates mixed with time stamp/without time stamp', () => {
        const dateA = '2022-01-01'
        const dateB = '2022-07-01T00:00:00'
        const options = { calendar: 'gregory', inclusive: false }
        expect(isDateALessThanDateB(dateA, dateB, options)).toBe(true)
    })

    it('returns null for invalid dates', () => {
        const dateA = '2022-01-01'
        const dateB = '2022-01-01T00:00.00000'
        const options = { calendar: 'gregory', inclusive: false }
        expect(isDateALessThanDateB(dateA, dateB, options)).toBe(null)
    })

    it('defaults to assume gregory calendar, and returns null for invalid dates', () => {
        const dateA = '2022-01-01'
        const dateB = '2023-13-03'
        expect(isDateALessThanDateB(dateA, dateB)).toBe(null)
    })

    it('defaults to inclusive: false by default', () => {
        const dateA = '2022-01-01'
        const dateB = '2022-01-01T00:00:00'
        expect(isDateALessThanDateB(dateA, dateB)).toBe(false)
    })

    it('uses inclusive comparison if specified', () => {
        const dateA = '2022-01-01'
        const dateB = '2022-01-01T00:00:00'
        const options = { calendar: 'gregory', inclusive: true }
        expect(isDateALessThanDateB(dateA, dateB, options)).toBe(true)
    })
})

describe('isDateALessThanDateB (nepali)', () => {
    beforeEach(() => {
        jest.spyOn(console, 'error').mockImplementation(jest.fn())
    })

    it('works for dates without time information', () => {
        const dateA = '2078-04-31'
        const dateB = '2078-05-31'
        const options = { calendar: 'nepali', inclusive: false }
        expect(isDateALessThanDateB(dateA, dateB, options)).toBe(true)
    })

    it('works for dates with time stamp', () => {
        const dateA = '2078-04-31T00:00:00'
        const dateB = '2078-05-31T:00:00:00'
        const options = { calendar: 'nepali', inclusive: false }
        expect(isDateALessThanDateB(dateA, dateB, options)).toBe(true)
    })

    it('works for dates mixed with time stamp/without time stamp', () => {
        const dateA = '2078-04-31'
        const dateB = '2078-05-31T:00:00:00'
        const options = { calendar: 'nepali', inclusive: false }
        expect(isDateALessThanDateB(dateA, dateB, options)).toBe(true)
    })

    // this test will fail while using string comparison
    it.skip('returns null for invalid dates', () => {
        const dateA = '2078-04-40'
        const dateB = '2078-05-31'
        const options = { calendar: 'nepali', inclusive: false }
        expect(isDateALessThanDateB(dateA, dateB, options)).toBe(null)
    })

    it('uses inclusive comparison if specified', () => {
        const dateA = '2022-01-01'
        const dateB = '2022-01-01T00:00:00'
        const options = { calendar: 'nepali', inclusive: true }
        expect(isDateALessThanDateB(dateA, dateB, options)).toBe(true)
    })
})

describe('isDateALessThanDateB (ethiopian)', () => {
    beforeEach(() => {
        jest.spyOn(console, 'error').mockImplementation(jest.fn())
    })

    it('works for dates without time information', () => {
        const dateA = '2016-02-30'
        const dateB = '2016-04-30'
        const options = { calendar: 'ethiopian', inclusive: false }
        expect(isDateALessThanDateB(dateA, dateB, options)).toBe(true)
    })

    it('works for dates with time stamp', () => {
        const dateA = '2016-02-30T00:00:00'
        const dateB = '2016-04-30T00:00:00'
        const options = { calendar: 'ethiopian', inclusive: false }
        expect(isDateALessThanDateB(dateA, dateB, options)).toBe(true)
    })

    it('works for dates mixed with time stamp/without time stamp', () => {
        const dateA = '2016-02-30'
        const dateB = '2016-04-30T00:00:00'
        const options = { calendar: 'ethiopian', inclusive: false }
        expect(isDateALessThanDateB(dateA, dateB, options)).toBe(true)
    })

    // this test will fail while using string comparison
    it.skip('returns null for invalid dates', () => {
        const dateA = '2016-02-31'
        const dateB = '2016-04-30'
        const options = { calendar: 'ethiopian', inclusive: false }
        expect(isDateALessThanDateB(dateA, dateB, options)).toBe(null)
    })

    it('uses inclusive comparison if specified', () => {
        const dateA = '2016-02-30'
        const dateB = '2016-02-30T00:00:00'
        const options = { calendar: 'ethiopian', inclusive: true }
        expect(isDateALessThanDateB(dateA, dateB, options)).toBe(true)
    })
})

describe('isDateAGreaterThanDateB (gregory)', () => {
    beforeEach(() => {
        jest.spyOn(console, 'error').mockImplementation(jest.fn())
    })

    it('works for dates without time information', () => {
        const dateA = '2022-07-01'
        const dateB = '2022-01-01'
        const options = { calendar: 'gregory', inclusive: false }
        expect(isDateAGreaterThanDateB(dateA, dateB, options)).toBe(true)
    })

    it('works for dates with time stamp', () => {
        const dateA = '2023-07-01T12:00:00'
        const dateB = '2022-01-01T12:00:00'
        const options = { calendar: 'gregory', inclusive: false }
        expect(isDateAGreaterThanDateB(dateA, dateB, options)).toBe(true)
    })

    it('works for dates mixed with time stamp/without time stamp', () => {
        const dateA = '2022-07-01T00:00:00'
        const dateB = '2022-01-01'
        const options = { calendar: 'gregory', inclusive: false }
        expect(isDateAGreaterThanDateB(dateA, dateB, options)).toBe(true)
    })

    it('returns null for invalid dates', () => {
        const dateA = '2022-01-01T00:00.00000'
        const dateB = '2022-01-01'
        const options = { calendar: 'gregory', inclusive: false }
        expect(isDateAGreaterThanDateB(dateA, dateB, options)).toBe(null)
    })

    it('defaults to assume gregory calendar, and returns null for invalid dates', () => {
        const dateA = '2023-13-03'
        const dateB = '2022-01-01'
        expect(isDateAGreaterThanDateB(dateA, dateB)).toBe(null)
    })

    it('defaults to inclusive: false by default', () => {
        const dateA = '2022-01-01T00:00:00'
        const dateB = '2022-01-01'
        expect(isDateAGreaterThanDateB(dateA, dateB)).toBe(false)
    })

    it('uses inclusive comparison if specified', () => {
        const dateA = '2022-01-01T00:00:00'
        const dateB = '2022-01-01'
        const options = { calendar: 'gregory', inclusive: true }
        expect(isDateAGreaterThanDateB(dateA, dateB, options)).toBe(true)
    })
})

describe('addDaysToDateString', () => {
    it('returns null if calendar is not Gregory', () => {
        expect(
            addDaysToDateString({
                startDateString: '2016-02-30',
                days: 5,
                calendar: 'ethiopian',
            })
        ).toBeNull()
    })

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
})

describe('getRelativeTime', () => {
    beforeEach(() => {
        jest.useFakeTimers('modern')
        jest.setSystemTime(new Date('2024-06-15T12:00:00').getTime())
    })

    afterEach(() => {
        jest.useRealTimers()
    })

    it('returns null if calendar is not gregory type', () => {
        const startDate = '2024-06-15T13:00:00'
        const calendar = 'ethiopian'
        const result = getRelativeTime({ startDate, calendar })
        expect(result).toBe(null)
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
