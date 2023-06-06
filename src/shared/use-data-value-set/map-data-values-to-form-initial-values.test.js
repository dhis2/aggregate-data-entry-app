import mapDataValuesToFormInitialValues from './map-data-values-to-form-initial-values.js'

describe('mapDataValuesToFormInitialValues', () => {
    it('should return an empty object when provided a faulty values', () => {
        expect(mapDataValuesToFormInitialValues(undefined)).toEqual({})
    })

    it('should return transform the data values from an array to an object', () => {
        const dataValues = [
            { dataElement: 'de1', categoryOptionCombo: 'coc1', value: 3 },
            { dataElement: 'de2', categoryOptionCombo: 'coc2', value: 4 },
            { dataElement: 'de3', categoryOptionCombo: 'coc3', value: 5 },
        ]

        const expected = {
            de1: {
                coc1: {
                    dataElement: 'de1',
                    categoryOptionCombo: 'coc1',
                    value: 3,
                },
            },
            de2: {
                coc2: {
                    dataElement: 'de2',
                    categoryOptionCombo: 'coc2',
                    value: 4,
                },
            },
            de3: {
                coc3: {
                    dataElement: 'de3',
                    categoryOptionCombo: 'coc3',
                    value: 5,
                },
            },
        }

        const actual = mapDataValuesToFormInitialValues(dataValues)

        expect(actual).toEqual(expected)
    })
})
