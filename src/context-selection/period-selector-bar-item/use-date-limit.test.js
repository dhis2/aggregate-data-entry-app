import { computeDateLimit } from './use-date-limit.js'

/**
 * Should add future periods, even when spanning over several years
 */
describe('computeDateLimit', () => {
    it('should be current date if no openFuturePeriods', () => {
        const dateString = '2022-09-27'
        const now = new Date(dateString)
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
            adjustedCurrentDateString: dateString,
        })

        expect(actual).toEqual(now)
    })

    it('should be 2022-10-01 if current date: 2022-08-31, periodType: Monthly, openFuturePeriods: 2', () => {
        const dateString = '2022-08-31'
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
            adjustedCurrentDateString: dateString,
        })
        const expected = new Date('2022-10-01')

        expect(actual.getTime()).toEqual(expected.getTime())
    })

    it('should be 2022-10-01 if current date: 2022-08-01, periodType: Monthly, openFuturePeriods: 2', () => {
        const dateString = '2022-08-01'
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
            adjustedCurrentDateString: dateString,
        })
        const expected = new Date('2022-10-01')

        expect(actual.getTime()).toEqual(expected.getTime())
    })

    it('should be 2025-01-01 if current date: 2022-08-01, periodType: Yearly, openFuturePeriods: 3', () => {
        const dateString = '2022-08-01'
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
            adjustedCurrentDateString: dateString,
        })
        const expected = new Date('2025-01-01')

        expect(actual.getTime()).toEqual(expected.getTime())
    })
})
