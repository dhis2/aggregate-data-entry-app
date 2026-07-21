import { renderHook } from '@testing-library/react'
import { useValueStore } from '../../shared/stores/data-value-store.js'
import { useValueMatrix } from './use-value-matrix.js'

const fakeValueStore = {
    de1: {
        coc1: {
            value: '1',
        },
        coc2: {
            value: 'text',
        },
        coc3: {
            value: '3',
        },
        coc4: {
            value: '4',
        },
    },
    de2: {
        coc2: {
            value: '20',
        },
        coc4: {
            value: '40',
        },
    },
    de3: {
        coc1: {
            value: '100',
        },
        coc2: {
            value: '200',
        },
        coc3: {
            value: '300',
        },
        coc4: {
            value: '400',
        },
    },
}

jest.mock('../../shared/stores/data-value-store', () => ({
    useValueStore: jest.fn(),
}))

describe('useValueMatrix', () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })
    it('renders the matrix with DEs as rows and COCs as columns by default', () => {
        const des = [{ id: 'de1' }, { id: 'de2' }]
        const sortedCOCs = [
            { id: 'coc1' },
            { id: 'coc2' },
            { id: 'coc3' },
            { id: 'coc4' },
        ]
        useValueStore.mockReturnValueOnce(fakeValueStore)
        /*
    dataElements,
    sortedCOCs,
    pivotType,
    pivotedCategory,
    categories,
*/
        const { result } = renderHook(() =>
            useValueMatrix({ dataElements: des, sortedCOCs })
        )
        expect(result.current).toEqual([
            ['1', 'text', '3', '4'],
            [undefined, '20', undefined, '40'],
        ])
    })
    it('renders the matrix with COCs as rows and DEs as columns if pivot=true', () => {
        const des = [{ id: 'de1' }, { id: 'de2' }]
        const sortedCOCs = [
            { id: 'coc1' },
            { id: 'coc2' },
            { id: 'coc3' },
            { id: 'coc4' },
        ]
        useValueStore.mockReturnValueOnce(fakeValueStore)

        const { result } = renderHook(() =>
            useValueMatrix({
                dataElements: des,
                sortedCOCs,
                pivotType: 'pivot',
            })
        )
        expect(result.current).toEqual([
            ['1', undefined],
            ['text', '20'],
            ['3', undefined],
            ['4', '40'],
        ])
    })
    it('renders an appropriate partially pivoted matrix based on pivotedCategory', () => {
        const des = [{ id: 'de1' }, { id: 'de2' }]
        const sortedCOCs = [
            { id: 'coc1', categoryOptions: ['catOptA', 'catOptY'] },
            { id: 'coc2', categoryOptions: ['catOptA', 'catOptZ'] },
            { id: 'coc3', categoryOptions: ['catOptB', 'catOptY'] },
            { id: 'coc4', categoryOptions: ['catOptB', 'catOptZ'] },
        ]
        const pivotType = 'move_categories'
        const pivotedCategory = 'cat1'
        const categories = [
            { id: 'cat1', categoryOptions: ['catOptA', 'catOptB'] },
            { id: 'cat2', categoryOptions: ['catOptY', 'catOptZ'] },
        ]
        useValueStore.mockReturnValueOnce(fakeValueStore)

        const { result } = renderHook(() =>
            useValueMatrix({
                dataElements: des,
                sortedCOCs,
                pivotType,
                pivotedCategory,
                categories,
            })
        )
        expect(result.current).toEqual([
            ['1', 'text'],
            ['3', '4'],
            [undefined, '20'],
            [undefined, '40'],
        ])

        /*
                    ['1','text'],
            ['3','4'],
            [undefined,'20'],
            [undefined,'40'],
            */
        /*
                    [de1/A/Y/coc1,de1/A/Z/coc2],
            [de1/B/Y/coc3,de1/B/Z/coc4],
            [de2/A/Y/coc1,de2/A/Z/coc2],
            [de2/B/Y/coc3,de2/B/Z/coc4],   
            */
    })
})
