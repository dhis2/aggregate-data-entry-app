import { setDataValueInQueryData } from './optimistic-update-helpers.js'

describe('setDataValueInQueryData', () => {
    let previousQueryData, dataValueMutationParams

    beforeEach(() => {
        previousQueryData = {
            dataValues: [
                {
                    dataElement: 'M3anTdbJ7iJ',
                    period: '2021April',
                    orgUnit: 'DiszpKrYNg8',
                    categoryOptionCombo: 'HllvX50cXC0',
                    attribute: {
                        combo: 'bjDvmb4bfuf',
                        options: ['xYerKDKCefk'],
                    },
                    value: '2',
                    followUp: false,
                    storedBy: 'admin',
                    created: '2022-09-06T15:46:46.774',
                    lastUpdated: '2022-09-06T15:46:46.774',
                },
            ],
            minMaxValues: [],
            lockStatus: 'OPEN',
            completeStatus: {
                complete: false,
            },
        }

        dataValueMutationParams = {
            de: 'BDuY694ZAFa',
            co: 'HllvX50cXC0',
            ds: 'rsyjyJmYD4J',
            ou: 'DiszpKrYNg8',
            pe: '2021April',
        }
    })
    it('should add a new data value object if it did not exist before', () => {
        const newValue = 133
        const result = setDataValueInQueryData({
            previousQueryData,
            dataValueIndex: -1,
            variables: { value: newValue },
            dataValueMutationParams,
        })
        expect(result.dataValues.length).toEqual(
            previousQueryData.dataValues.length + 1
        )
        expect(result.dataValues[1].value).toEqual(newValue)
    })
    it('should match and update the existing data value object if it existed before', () => {
        previousQueryData.dataValues[0].followUp = true
        const newValue = 133
        const result = setDataValueInQueryData({
            previousQueryData,
            dataValueIndex: 0,
            variables: { value: newValue },
            dataValueMutationParams,
        })
        expect(result.dataValues.length).toEqual(
            previousQueryData.dataValues.length
        )
        expect(result.dataValues[0].value).toEqual(newValue)
        expect(result.dataValues[0].followUp).toEqual(true)
    })
    it('should make sure that an updated data value object removes the followUp flag when deleted', () => {
        previousQueryData.dataValues[0].followUp = true
        const result = setDataValueInQueryData({
            previousQueryData,
            dataValueIndex: 0,
            variables: { value: '' },
            dataValueMutationParams,
        })
        expect(result.dataValues.length).toEqual(
            previousQueryData.dataValues.length
        )
        expect(result.dataValues[0].value).toEqual('')
        expect(result.dataValues[0].followUp).toEqual(false)
    })
})
