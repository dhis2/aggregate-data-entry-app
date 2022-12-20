import {
    getCellId,
    parseCellId,
    getCellIdFromDataValueParams,
    getCellIdFromMutationKey,
} from './get-cell-id.js'

test('getCellId', () => {
    const contextSelectionId = 'aoc-id1;aoc-id2,ds-id,ou-id,2022'
    const item = { dataElement: 'de-id', categoryOptionCombo: 'coc-id' }
    const expected = 'aoc-id1;aoc-id2,ds-id,ou-id,2022_de-id_coc-id'
    const actual = getCellId({ contextSelectionId, item })
    expect(actual).toBe(expected)
})

test('parseCellId', () => {
    const cellId = 'aoc-id1;aoc-id2,ds-id,ou-id,2022_de-id_coc-id'
    const actual = parseCellId(cellId)
    const expected = {
        attributeOptions: 'aoc-id1;aoc-id2',
        dataSetId: 'ds-id',
        dataElement: 'de-id',
        orgUnitId: 'ou-id',
        periodId: '2022',
        categoryOptionCombo: 'coc-id',
    }
    expect(actual).toEqual(expected)
})

describe('getCellIdFromDataValueParams', () => {
    it('should return null when the params are falsy', () => {
        expect(getCellIdFromDataValueParams(null)).toBe(null)
        expect(getCellIdFromDataValueParams(undefined)).toBe(null)
        expect(getCellIdFromDataValueParams('')).toBe(null)
        expect(getCellIdFromDataValueParams(0)).toBe(null)
        expect(getCellIdFromDataValueParams(false)).toBe(null)
    })

    it('should return a cell id', () => {
        const params = {
            cp: 'aoc-id1;aoc-id2',
            ds: 'ds-id',
            ou: 'ou-id',
            pe: '2022',
            de: 'de-id',
            co: 'coc-id',
        }

        const expected = 'aoc-id1;aoc-id2,ds-id,ou-id,2022_de-id_coc-id'
        const actual = getCellIdFromDataValueParams(params)

        expect(actual).toBe(expected)
    })
})

test('getCellIdFromMutationKey', () => {
    const params = {
        cp: 'aoc-id1;aoc-id2',
        ds: 'ds-id',
        ou: 'ou-id',
        pe: '2022',
        de: 'de-id',
        co: 'coc-id',
    }
    const mutationKey = ['dataValues', { method: 'update', params }]

    const expected = 'aoc-id1;aoc-id2,ds-id,ou-id,2022_de-id_coc-id'
    const actual = getCellIdFromMutationKey(mutationKey)

    expect(actual).toBe(expected)
})
