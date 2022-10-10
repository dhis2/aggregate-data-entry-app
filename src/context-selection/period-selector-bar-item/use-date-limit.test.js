import { computeDateLimit } from './use-date-limit.js'

/**
 * Should add future periods, even when spanning over several years
 */
describe('computeDateLimit', () => {
    it('should be current date if no openFuturePeriods', () => {
        const now = new Date('2022-09-27')
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
            currentDateAtServerTimezone: now,
        })

        expect(actual).toEqual(now)
    })

    it('should be 2022-10-01 if current date: 2022-08-31, periodType: Monthly, openFuturePeriods: 2', () => {
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
            currentDateAtServerTimezone: new Date('2022-08-31'),
        })
        const expected = new Date('2022-10-01')

        expect(actual.getTime()).toEqual(expected.getTime())
    })

    it('should be 2022-10-01 if current date: 2022-08-01, periodType: Monthly, openFuturePeriods: 2', () => {
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
            currentDateAtServerTimezone: new Date('2022-08-01'),
        })
        const expected = new Date('2022-10-01')

        expect(actual.getTime()).toEqual(expected.getTime())
    })

    it('should be 2025-01-01 if current date: 2022-08-01, periodType: Yearly, openFuturePeriods: 3', () => {
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
            currentDateAtServerTimezone: new Date('2022-08-01'),
        })
        const expected = new Date('2025-01-01')

        expect(actual.getTime()).toEqual(expected.getTime())
    })
})
