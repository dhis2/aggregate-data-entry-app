import { QueryCache } from '@tanstack/react-query'
import { act, renderHook, waitFor } from '@testing-library/react'
import React from 'react'
import { Wrapper } from '../../test-utils/index.js'
import {
    useDataValueSet,
    useDataValueSetQueryKey,
} from '../use-data-value-set/index.js'
import {
    useDeleteDataValueMutation,
    useSetDataValueMutation,
    useUploadFileDataValueMutation,
} from './data-value-mutations.js'

jest.mock('../use-data-value-set/use-data-value-set-query-key.js', () => ({
    __esModule: true,
    default: jest.fn(() => []),
}))

jest.mock(
    '../../shared/use-context-selection/use-is-valid-selection.js',
    () => ({
        useIsValidSelection: jest.fn(() => true),
    })
)

describe('useSetDataValueMutation', () => {
    it('should cancel active data value set requests', async () => {
        useDataValueSetQueryKey.mockImplementation(() => ['dataValues'])
        const queryCache = new QueryCache()
        const dataValuesResolver = jest.fn(() => new Promise(() => null))

        // first we need to load the data value set so we have a loading state
        const { result: dataValueSet } = renderHook(useDataValueSet, {
            wrapper: ({ children }) => (
                <Wrapper
                    queryClientOptions={{ queryCache }}
                    dataForCustomProvider={{
                        dataValues: dataValuesResolver,
                    }}
                >
                    {children}
                </Wrapper>
            ),
        })

        // Make sure the request is on-going
        await waitFor(() => {
            expect(dataValuesResolver).toHaveBeenCalledTimes(1)
            return dataValueSet.current.isLoading
        })

        const { result: setDataValue } = renderHook(
            () =>
                useSetDataValueMutation({
                    deId: 'de-id',
                    cocId: 'coc-id',
                }),
            {
                wrapper: ({ children }) => (
                    <Wrapper
                        queryClientOptions={{ queryCache }}
                        dataForCustomProvider={{
                            // never resolving
                            dataValues: () => new Promise(() => null),
                        }}
                    >
                        {children}
                    </Wrapper>
                ),
            }
        )

        expect(dataValueSet.current.isLoading).toBe(true)

        // Mutate a current data value
        act(() => setDataValue.current.mutate())
        await waitFor(() => {
            // Can happen instantly -> isLoading is never true
            const { isLoading, isSuccess } = setDataValue.current
            expect(isLoading || isSuccess).toBeTrue()
        })

        // Ensure that the on-going data value set request is cancelled
        // await waitFor(() => !dataValueSet.current.isLoading)
        expect(dataValueSet.current.isLoading).toBe(false)
    })

    it('should create an initial data value in the cache via optimistic update', async () => {
        useDataValueSetQueryKey.mockImplementation(() => ['dataValues'])
        const queryCache = new QueryCache()

        const { result: setDataValue } = renderHook(
            () =>
                useSetDataValueMutation({
                    deId: 'de-id',
                    cocId: 'coc-id',
                }),
            {
                wrapper: ({ children }) => (
                    <Wrapper
                        queryClientOptions={{ queryCache }}
                        dataForCustomProvider={{
                            dataValues: () => Promise.resolve({}),
                        }}
                    >
                        {children}
                    </Wrapper>
                ),
            }
        )

        const initiallyCachedDataValuesQuery = queryCache.find({
            queryKey: ['dataValues'],
        })
        expect(initiallyCachedDataValuesQuery).toBeUndefined()

        // Mutate a current data value
        act(() => setDataValue.current.mutate({ value: '42' }))
        await waitFor(() => setDataValue.current.isSuccess)

        const cachedDataValuesQuery = queryCache.find({
            queryKey: ['dataValues'],
        })
        const cachedDataValues = cachedDataValuesQuery.state.data

        expect(cachedDataValues.dataValues).toHaveLength(1)

        const [newDataValue] = cachedDataValues.dataValues
        expect(newDataValue.value).toBe('42')
    })

    it('should update an initial data value in the cache via optimistic update', async () => {
        useDataValueSetQueryKey.mockImplementation(() => ['dataValues'])
        const queryCache = new QueryCache()

        // first we need to load the data value set so we have an entry
        const { result: dataValueSet } = renderHook(useDataValueSet, {
            wrapper: ({ children }) => (
                <Wrapper
                    queryClientOptions={{ queryCache }}
                    dataForCustomProvider={{
                        dataValues: {
                            dataValues: [
                                {
                                    dataElement: 'de-id',
                                    categoryOptionCombo: 'coc-id',
                                    value: '27',
                                },
                            ],
                        },
                    }}
                >
                    {children}
                </Wrapper>
            ),
        })

        // Make sure the request is on-going
        await waitFor(() => expect(dataValueSet.current.isSuccess).toBeTrue())

        const initiallyCachedDataValuesQuery = queryCache.find({
            queryKey: ['dataValues'],
        })
        const initiallyCachedDataValues =
            initiallyCachedDataValuesQuery.state.data
        expect(initiallyCachedDataValues.dataValues).toHaveLength(1)
        const [initialDataValue] = initiallyCachedDataValues.dataValues
        expect(initialDataValue.value).toBe('27')

        const { result: setDataValue } = renderHook(
            () =>
                useSetDataValueMutation({
                    deId: 'de-id',
                    cocId: 'coc-id',
                }),
            {
                wrapper: ({ children }) => (
                    <Wrapper
                        queryClientOptions={{ queryCache }}
                        dataForCustomProvider={{
                            dataValues: () => Promise.resolve({}),
                        }}
                    >
                        {children}
                    </Wrapper>
                ),
            }
        )

        // Mutate a current data value
        act(() => setDataValue.current.mutate({ value: '42' }))
        await waitFor(() => setDataValue.current.isSuccess)

        const cachedDataValuesQuery = queryCache.find({
            queryKey: ['dataValues'],
        })
        const cachedDataValues = cachedDataValuesQuery.state.data

        expect(cachedDataValues.dataValues).toHaveLength(1)

        const [newDataValue] = cachedDataValues.dataValues
        expect(newDataValue.value).toBe('42')
    })
})

describe('useUploadFileDataValueMutation', () => {
    const file = new File(['[0,1]'], 'file.json', { type: 'application/JSON' })

    it('should cancel active data value set requests', async () => {
        useDataValueSetQueryKey.mockImplementation(() => ['dataValues'])
        const queryCache = new QueryCache()
        const dataValuesResolver = jest.fn(() => new Promise(() => null))

        // first we need to load the data value set so we have a loading state
        const { result: dataValueSet } = renderHook(useDataValueSet, {
            wrapper: ({ children }) => (
                <Wrapper
                    queryClientOptions={{ queryCache }}
                    dataForCustomProvider={{
                        dataValues: dataValuesResolver,
                    }}
                >
                    {children}
                </Wrapper>
            ),
        })

        // Make sure the request is on-going
        await waitFor(() => {
            expect(dataValuesResolver).toHaveBeenCalledTimes(1)
            return dataValueSet.current.isLoading
        })

        const { result: uploadFileDataValue } = renderHook(
            () =>
                useUploadFileDataValueMutation({
                    deId: 'de-id',
                    cocId: 'coc-id',
                }),
            {
                wrapper: ({ children }) => (
                    <Wrapper
                        queryClientOptions={{ queryCache }}
                        dataForCustomProvider={{
                            // never resolving
                            'dataValues/file': () => new Promise(() => null),
                        }}
                    >
                        {children}
                    </Wrapper>
                ),
            }
        )

        expect(dataValueSet.current.isLoading).toBe(true)

        // Mutate a current data value
        act(() => uploadFileDataValue.current.mutate({ file }))

        await waitFor(() => {
            // Can happen instantly -> isLoading is never true
            const { isLoading, isSuccess } = uploadFileDataValue.current
            return isLoading || isSuccess
        })

        // Ensure that the on-going data value set request is cancelled
        await waitFor(() => !dataValueSet.current.isLoading)
        expect(dataValueSet.current.isLoading).toBe(false)
    })

    it('should create an initial data value in the cache via optimistic update', async () => {
        useDataValueSetQueryKey.mockImplementation(() => ['dataValues'])
        const queryCache = new QueryCache()

        const { result: uploadFileDataValue } = renderHook(
            () =>
                useUploadFileDataValueMutation({
                    deId: 'de-id',
                    cocId: 'coc-id',
                }),
            {
                wrapper: ({ children }) => (
                    <Wrapper
                        queryClientOptions={{ queryCache }}
                        dataForCustomProvider={{
                            'dataValues/file': () => Promise.resolve({}),
                        }}
                    >
                        {children}
                    </Wrapper>
                ),
            }
        )

        const initiallyCachedDataValuesQuery = queryCache.find({
            queryKey: ['dataValues'],
        })
        expect(initiallyCachedDataValuesQuery).toBeUndefined()

        // Mutate a current data value
        act(() => uploadFileDataValue.current.mutate({ file }))
        await waitFor(() => uploadFileDataValue.current.isSuccess)

        const cachedDataValuesQuery = queryCache.find({
            queryKey: ['dataValues'],
        })
        const cachedDataValues = cachedDataValuesQuery.state.data

        expect(cachedDataValues.dataValues).toHaveLength(1)

        const [newDataValue] = cachedDataValues.dataValues
        expect(newDataValue.value).toEqual({ name: 'file.json', size: 5 })
    })

    it('should update an initial data value in the cache via optimistic update', async () => {
        useDataValueSetQueryKey.mockImplementation(() => ['dataValues'])
        const queryCache = new QueryCache()

        // first we need to load the data value set so we have an entry
        const { result: dataValueSet } = renderHook(useDataValueSet, {
            wrapper: ({ children }) => (
                <Wrapper
                    queryClientOptions={{ queryCache }}
                    dataForCustomProvider={{
                        dataValues: () =>
                            Promise.resolve({
                                dataValues: [
                                    {
                                        dataElement: 'de-id',
                                        categoryOptionCombo: 'coc-id',
                                        value: {
                                            name: 'foobar.json',
                                            size: 6,
                                        },
                                    },
                                ],
                            }),
                    }}
                >
                    {children}
                </Wrapper>
            ),
        })

        // Make sure the request is on-going
        await waitFor(() => expect(dataValueSet.current.isSuccess).toBeTrue())

        const initiallyCachedDataValuesQuery = queryCache.find({
            queryKey: ['dataValues'],
        })
        const initiallyCachedDataValues =
            initiallyCachedDataValuesQuery.state.data
        expect(initiallyCachedDataValues.dataValues).toHaveLength(1)
        const [initialDataValue] = initiallyCachedDataValues.dataValues
        expect(initialDataValue.value).toEqual({ name: 'foobar.json', size: 6 })

        const { result: uploadFileDataValue } = renderHook(
            () =>
                useUploadFileDataValueMutation({
                    deId: 'de-id',
                    cocId: 'coc-id',
                }),
            {
                wrapper: ({ children }) => (
                    <Wrapper
                        queryClientOptions={{ queryCache }}
                        dataForCustomProvider={{
                            'dataValues/file': () => Promise.resolve({}),
                        }}
                    >
                        {children}
                    </Wrapper>
                ),
            }
        )

        // Mutate a current data value
        act(() => uploadFileDataValue.current.mutate({ file }))
        await waitFor(() =>
            expect(uploadFileDataValue.current.isSuccess).toBeTrue()
        )

        const cachedDataValuesQuery = queryCache.find({
            queryKey: ['dataValues'],
        })
        const cachedDataValues = cachedDataValuesQuery.state.data

        expect(cachedDataValues.dataValues).toHaveLength(1)

        const [newDataValue] = cachedDataValues.dataValues
        expect(newDataValue.value).toEqual({ name: 'file.json', size: 5 })
    })
})

describe('useDeleteDataValueMutation', () => {
    it('should cancel active data value set requests', async () => {
        useDataValueSetQueryKey.mockImplementation(() => ['dataValues'])
        const queryCache = new QueryCache()
        const dataValuesResolver = jest.fn(() => new Promise(() => null))

        // first we need to load the data value set so we have a loading state
        const { result: dataValueSet } = renderHook(useDataValueSet, {
            wrapper: ({ children }) => (
                <Wrapper
                    queryClientOptions={{ queryCache }}
                    dataForCustomProvider={{
                        dataValues: dataValuesResolver,
                    }}
                >
                    {children}
                </Wrapper>
            ),
        })

        await waitFor(() => {
            expect(dataValuesResolver).toHaveBeenCalledTimes(1)
        })

        const { result: deleteDataValue } = renderHook(
            () =>
                useDeleteDataValueMutation({
                    deId: 'de-id',
                    cocId: 'coc-id',
                }),
            {
                wrapper: ({ children }) => (
                    <Wrapper
                        queryClientOptions={{ queryCache }}
                        dataForCustomProvider={{
                            // never resolving
                            dataValues: () => new Promise(() => null),
                        }}
                    >
                        {children}
                    </Wrapper>
                ),
            }
        )

        expect(dataValueSet.current.isLoading).toBe(true)

        // Mutate a current data value
        act(() => deleteDataValue.current.mutate())

        await waitFor(() => {
            // Can happen instantly -> isLoading is never true
            const { isLoading, isSuccess } = deleteDataValue.current
            return isLoading || isSuccess
        })

        // Ensure that the on-going data value set request is cancelled
        await waitFor(() => !dataValueSet.current.isLoading)
        expect(dataValueSet.current.isLoading).toBe(false)
    })

    it('should delete an initial data value in the cache via optimistic update', async () => {
        useDataValueSetQueryKey.mockImplementation(() => ['dataValues'])
        const queryCache = new QueryCache()

        // first we need to load the data value set so we have an entry
        const { result: dataValueSet } = renderHook(useDataValueSet, {
            wrapper: ({ children }) => (
                <Wrapper
                    queryClientOptions={{ queryCache }}
                    dataForCustomProvider={{
                        dataValues: () =>
                            Promise.resolve({
                                dataValues: [
                                    {
                                        dataElement: 'de-id',
                                        categoryOptionCombo: 'coc-id',
                                        value: {
                                            name: 'foobar.json',
                                            size: 6,
                                        },
                                    },
                                ],
                            }),
                    }}
                >
                    {children}
                </Wrapper>
            ),
        })

        // Make sure the request is on-going
        await waitFor(() => expect(dataValueSet.current.isSuccess).toBeTrue())

        const initiallyCachedDataValuesQuery = queryCache.find({
            queryKey: ['dataValues'],
        })
        const initiallyCachedDataValues =
            initiallyCachedDataValuesQuery.state.data
        expect(initiallyCachedDataValues.dataValues).toHaveLength(1)
        const [initialDataValue] = initiallyCachedDataValues.dataValues
        expect(initialDataValue.value).toEqual({ name: 'foobar.json', size: 6 })

        const { result: deleteDataValue } = renderHook(
            () =>
                useDeleteDataValueMutation({
                    deId: 'de-id',
                    cocId: 'coc-id',
                }),
            {
                wrapper: ({ children }) => (
                    <Wrapper
                        queryClientOptions={{ queryCache }}
                        dataForCustomProvider={{
                            dataValues: () => Promise.resolve({}),
                        }}
                    >
                        {children}
                    </Wrapper>
                ),
            }
        )

        // Mutate a current data value
        act(() => deleteDataValue.current.mutate())
        await waitFor(() => deleteDataValue.current.isSuccess)

        const cachedDataValuesQuery = queryCache.find({
            queryKey: ['dataValues'],
        })
        const cachedDataValues = cachedDataValuesQuery.state.data

        expect(cachedDataValues.dataValues).toHaveLength(0)
    })
})
