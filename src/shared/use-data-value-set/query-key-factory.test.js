import { dataValueSets } from './query-key-factory.js'

describe('dataValueSets', () => {
    describe('byIds', () => {
        it('generates the expected query key', () => {
            const queryKey = dataValueSets.byIds({
                dataSetId: 'dataSetId',
                periodId: 'periodId',
                orgUnitId: 'orgUnitId',
                categoryComboId: 'categoryComboId',
                categoryOptionIds: ['categoryOptionId1', 'categoryOptionId2'],
            })

            expect(queryKey).toMatchInlineSnapshot(`
                Array [
                  "dataEntry/dataValues",
                  Object {
                    "params": Object {
                      "cc": "categoryComboId",
                      "cp": "categoryOptionId1;categoryOptionId2",
                      "ds": "dataSetId",
                      "ou": "orgUnitId",
                      "pe": "periodId",
                    },
                  },
                ]
            `)
        })
    })
})
