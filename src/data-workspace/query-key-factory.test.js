import { dataValueSets } from './query-key-factory.js'

describe('dataValueSets', () => {
    describe('byIds', () => {
        it('generates the expected query key', () => {
            const queryKey = dataValueSets.byIds({
                dataSetId: 'dataSetId',
                periodId: 'periodId',
                orgUnitId: 'orgUnitId',
                attributeCombo: 'attributeCombo',
                attributeOptions: 'attributeOptions',
            })

            expect(queryKey).toMatchInlineSnapshot(`
                Array [
                  "dataValueSets",
                  Object {
                    "params": Object {
                      "attributeCombo": "attributeCombo",
                      "attributeOptions": "attributeOptions",
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
