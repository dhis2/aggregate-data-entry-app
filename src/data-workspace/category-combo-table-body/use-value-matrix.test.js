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
    },
    de2: {
        coc2: {
            value: '20',
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
        const sortedCOCs = [{ id: 'coc1' }, { id: 'coc2' }, { id: 'coc3' }]
        useValueStore.mockReturnValueOnce(fakeValueStore)

        const { result } = renderHook(() => useValueMatrix(des, sortedCOCs))
        expect(result.current).toEqual([
            ['1', 'text', '3'],
            [undefined, '20', undefined],
        ])
    })
    it('renders the matrix with COCs as rows and DEs as columns if pivot=true', () => {
        const des = [{ id: 'de1' }, { id: 'de2' }]
        const sortedCOCs = [{ id: 'coc1' }, { id: 'coc2' }, { id: 'coc3' }]
        useValueStore.mockReturnValueOnce(fakeValueStore)

        const { result } = renderHook(() =>
            useValueMatrix(des, sortedCOCs, true)
        )
        expect(result.current).toEqual([
            ['1', undefined],
            ['text', '20'],
            ['3', undefined],
        ])
    })
})
