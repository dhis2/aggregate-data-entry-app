import { dataValueSets } from './query-key-factory.js'

describe('dataValueSets', () => {
    describe('byIds', () => {
        it('generates the expected query key', () => {
            const queryKey = dataValueSets.byIds({
                ds: 'dataSetId',
                pe: 'periodId',
                ou: 'orgUnitId',
            })

            expect(queryKey).toMatchInlineSnapshot(`
                Array [
                  "dataEntry/dataValues",
                  Object {
                    "params": Object {
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
