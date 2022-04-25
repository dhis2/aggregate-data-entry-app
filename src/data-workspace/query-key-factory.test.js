import { dataValueSets } from './query-key-factory.js'

describe('dataValueSets', () => {
    describe('byIds', () => {
        it('generates the expected query key', () => {
            const queryKey = dataValueSets.byIds({
                dataSetId: 'dataSetId',
                periodId: 'periodId',
                orgUnitId: 'orgUnitId',
                attributeOptionCombo: 'attributeOptionCombo',
            })

            expect(queryKey).toMatchInlineSnapshot(`
                Array [
                  "dataValueSets",
                  Object {
                    "params": Object {
                      "attributeOptionCombo": "attributeOptionCombo",
                      "dataSet": "dataSetId",
                      "orgUnit": "orgUnitId",
                      "period": "periodId",
                    },
                  },
                ]
            `)
        })
    })
})
