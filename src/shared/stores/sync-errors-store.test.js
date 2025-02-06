import { act, renderHook } from '@testing-library/react'
import { useSyncErrorsStore } from './sync-errors-store.js'

describe('highlighted field store', () => {
    const initialState = useSyncErrorsStore.getState()

    beforeEach(() => {
        useSyncErrorsStore.setState(initialState)
    })

    it('should have no errors initially', () => {
        const { result } = renderHook(useSyncErrorsStore)
        expect(result.current.errors).toEqual({})
        expect(result.current.getErrors()).toEqual({})
    })

    it('should set an error to a provided id', async () => {
        const cellId = 'aoc-id1;aoc-id2,ds-id,ou-id,2022_de-id_coc-id'
        const { result } = renderHook(useSyncErrorsStore)

        act(() => {
            result.current.setErrorById(cellId, 'Error message')
        })

        const error = result.current.getErrorById(cellId)
        expect(error).toBe('Error message')
    })

    it('should set an error by mutation error', async () => {
        const params = {
            cp: 'aoc-id1;aoc-id2',
            ds: 'ds-id',
            ou: 'ou-id',
            pe: '2022',
            de: 'de-id',
            co: 'coc-id',
        }
        const mutationKey = ['dataValues', { method: 'update', params }]
        const apiMutationError = new Error('I am an error')
        apiMutationError.mutationKey = mutationKey

        const { result } = renderHook(useSyncErrorsStore)

        act(() => {
            result.current.setError(apiMutationError)
        })

        const cellId = 'aoc-id1;aoc-id2,ds-id,ou-id,2022_de-id_coc-id'

        const error = result.current.getErrorById(cellId)
        expect(error).toBe(apiMutationError)
    })

    it('should clear an error by id', async () => {
        const params = {
            cp: 'aoc-id1;aoc-id2',
            ds: 'ds-id',
            ou: 'ou-id',
            pe: '2022',
            de: 'de-id',
            co: 'coc-id',
        }
        const mutationKey = ['dataValues', { method: 'update', params }]
        const apiMutationError = new Error('I am an error')
        apiMutationError.mutationKey = mutationKey

        const cellId = 'aoc-id1;aoc-id2,ds-id,ou-id,2022_de-id_coc-id'
        useSyncErrorsStore.setState({
            errors: { [cellId]: apiMutationError },
        })

        const { result, waitFor } = renderHook(useSyncErrorsStore)

        act(() => {
            result.current.clearErrorById(cellId)
        })

        const error = result.current.getErrorById(cellId)
        expect(error).toBe(undefined)
    })

    it('should clear an error by mutation key', async () => {
        const params = {
            cp: 'aoc-id1;aoc-id2',
            ds: 'ds-id',
            ou: 'ou-id',
            pe: '2022',
            de: 'de-id',
            co: 'coc-id',
        }
        const mutationKey = ['dataValues', { method: 'update', params }]
        const apiMutationError = new Error('I am an error')
        apiMutationError.mutationKey = mutationKey

        const cellId = 'aoc-id1;aoc-id2,ds-id,ou-id,2022_de-id_coc-id'
        useSyncErrorsStore.setState({
            errors: { [cellId]: apiMutationError },
        })

        const { result, waitFor } = renderHook(useSyncErrorsStore)

        act(() => {
            result.current.clearErrorByMutationKey(mutationKey)
        })

        const error = result.current.getErrorById(cellId)
        expect(error).toBe(undefined)
    })

    it('should clear an error by data value params', async () => {
        const params = {
            cp: 'aoc-id1;aoc-id2',
            ds: 'ds-id',
            ou: 'ou-id',
            pe: '2022',
            de: 'de-id',
            co: 'coc-id',
        }
        const mutationKey = ['dataValues', { method: 'update', params }]
        const apiMutationError = new Error('I am an error')
        apiMutationError.mutationKey = mutationKey

        const cellId = 'aoc-id1;aoc-id2,ds-id,ou-id,2022_de-id_coc-id'
        useSyncErrorsStore.setState({
            errors: { [cellId]: apiMutationError },
        })

        const { result, waitFor } = renderHook(useSyncErrorsStore)

        act(() => {
            result.current.clearErrorByDataValueParams(params)
        })

        const error = result.current.getErrorById(cellId)
        expect(error).toBe(undefined)
    })

    it('should clear all errors', async () => {
        const params1 = {
            cp: 'aoc-id1;aoc-id2',
            ds: 'ds-id',
            ou: 'ou-id',
            pe: '2022',
            de: 'de-id',
            co: 'coc-id',
        }
        const mutationKey1 = [
            'dataValues',
            { method: 'update', params: params1 },
        ]
        const apiMutationError1 = new Error('I am an error 1')
        apiMutationError1.mutationKey = mutationKey1

        const params2 = {
            ds: 'ds-id',
            ou: 'ou-id',
            pe: '2022',
            de: 'de-id',
            co: 'coc-id',
        }
        const mutationKey2 = [
            'dataValues',
            { method: 'update', params: params2 },
        ]
        const apiMutationError2 = new Error('I am an error 2')
        apiMutationError2.mutationKey = mutationKey2

        const cellId1 = 'aoc-id1;aoc-id2,ds-id,ou-id,2022_de-id_coc-id'
        const cellId2 = ',ds-id,ou-id,2022_de-id_coc-id'
        useSyncErrorsStore.setState({
            errors: {
                [cellId1]: apiMutationError1,
                [cellId2]: apiMutationError2,
            },
        })

        const { result, waitFor } = renderHook(useSyncErrorsStore)

        act(() => {
            result.current.clearAll()
        })

        const error = result.current.getErrors()
        expect(error).toEqual({})
    })

    it('should get all errors for a selection', () => {
        const params1 = {
            cp: 'aoc-id1;aoc-id2',
            ds: 'ds-id',
            ou: 'ou-id',
            pe: '2022',
            de: 'de-id',
            co: 'coc-id',
        }
        const mutationKey1 = [
            'dataValues',
            { method: 'update', params: params1 },
        ]
        const apiMutationError1 = new Error('I am an error 1')
        apiMutationError1.mutationKey = mutationKey1

        const params2 = {
            ds: 'ds-id',
            ou: 'ou-id',
            pe: '2022',
            de: 'de-id',
            co: 'coc-id',
        }
        const mutationKey2 = [
            'dataValues',
            { method: 'update', params: params2 },
        ]
        const apiMutationError2 = new Error('I am an error 2')
        apiMutationError2.mutationKey = mutationKey2

        const cellId1 = 'aoc-id1;aoc-id2,ds-id,ou-id,2022_de-id_coc-id'
        const cellId2 = ',ds-id,ou-id,2022_de-id_coc-id'
        useSyncErrorsStore.setState({
            errors: {
                [cellId1]: apiMutationError1,
                [cellId2]: apiMutationError2,
            },
        })

        const { result } = renderHook(useSyncErrorsStore)
        const contextSelectionId = 'aoc-id1;aoc-id2,ds-id,ou-id,2022'
        const errors = result.current.getErrorsForSelection(contextSelectionId)

        expect(errors).toEqual([
            {
                field: {
                    attributeOptions: 'aoc-id1;aoc-id2',
                    categoryOptionCombo: 'coc-id',
                    dataElement: 'de-id',
                    dataSetId: 'ds-id',
                    orgUnitId: 'ou-id',
                    periodId: '2022',
                },
                error: apiMutationError1,
            },
        ])
    })

    it('should return the number of errors', () => {
        const params1 = {
            cp: 'aoc-id1;aoc-id2',
            ds: 'ds-id',
            ou: 'ou-id',
            pe: '2022',
            de: 'de-id',
            co: 'coc-id',
        }
        const mutationKey1 = [
            'dataValues',
            { method: 'update', params: params1 },
        ]
        const apiMutationError1 = new Error('I am an error 1')
        apiMutationError1.mutationKey = mutationKey1

        const params2 = {
            ds: 'ds-id',
            ou: 'ou-id',
            pe: '2022',
            de: 'de-id',
            co: 'coc-id',
        }
        const mutationKey2 = [
            'dataValues',
            { method: 'update', params: params2 },
        ]
        const apiMutationError2 = new Error('I am an error 2')
        apiMutationError2.mutationKey = mutationKey2

        const cellId1 = 'aoc-id1;aoc-id2,ds-id,ou-id,2022_de-id_coc-id'
        const cellId2 = ',ds-id,ou-id,2022_de-id_coc-id'
        useSyncErrorsStore.setState({
            errors: {
                [cellId1]: apiMutationError1,
                [cellId2]: apiMutationError2,
            },
        })

        const { result } = renderHook(useSyncErrorsStore)
        const numbersOfErrors = result.current.getNumberOfErrors()

        expect(numbersOfErrors).toBe(2)
    })
})
