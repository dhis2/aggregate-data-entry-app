import { getNowInCalendarString } from './get-now-in-calendar.js'

describe('getNowInCalendarString', () => {
    beforeEach(() => {
        jest.useFakeTimers('modern')
        jest.setSystemTime(new Date('2024-06-15T12:00:00').getTime())
    })

    afterEach(() => {
        jest.useRealTimers()
    })

    it('returns YYYY-MM-DD and assumes gregory calendar by default', () => {
        const result = getNowInCalendarString()
        expect(result).toBe('2024-06-15')
    })

    it('returns date in long format if specified', () => {
        const result = getNowInCalendarString({ long: true })
        expect(result).toBe('2024-06-15T12:00:00')
    })

    it('corrects for time zone difference', () => {
        const long = true
        const timezone = 'Africa/Kigali'
        const result = getNowInCalendarString({ long, timezone })
        // Kigali is UTC+2
        expect(result).toBe('2024-06-15T14:00:00')
    })

    it('corrects for time zone difference', () => {
        const long = true
        const timezone = 'Africa/Kigali'
        const result = getNowInCalendarString({ long, timezone })
        // Kigali is UTC+2
        expect(result).toBe('2024-06-15T14:00:00')
    })

    it('handles nepali calendar', () => {
        const long = true
        const calendar = 'nepali'
        const result = getNowInCalendarString({ long, calendar })
        expect(result).toBe('2081-03-01T12:00:00')
    })

    it('handles ethiopian calendar', () => {
        const long = true
        const calendar = 'ethiopian'
        const result = getNowInCalendarString({ long, calendar })
        expect(result).toBe('2016-10-08T12:00:00')
    })
})
