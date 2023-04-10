import { QueryCache } from '@tanstack/react-query'
import { act, renderHook } from '@testing-library/react-hooks'
import React from 'react'
import { Wrapper } from '../../test-utils/index.js'
import {
    useDataValueSet,
    useDataValueSetQueryKey,
} from '../use-data-value-set/index.js'
import { useSetDataValueMutation } from './data-value-mutations.js'

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
        const { result: dataValueSet, waitFor: waitForDataValueSet } =
            renderHook(useDataValueSet, {
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
        await waitForDataValueSet(() => {
            expect(dataValuesResolver).toHaveBeenCalledTimes(1)
            return dataValueSet.current.isLoading
        })

        const { result: sharedDataValue, waitFor: waitForSharedDataValue } =
            renderHook(
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
        act(() => sharedDataValue.current.mutate())
        await waitForSharedDataValue(() => {
            // Can happen instantly -> isLoading is never true
            const { isLoading, isSuccess } = sharedDataValue.current
            return isLoading || isSuccess
        })

        // Ensure that the on-going data value set request is cancelled
        await waitForDataValueSet(() => !dataValueSet.current.isLoading)
        expect(dataValueSet.current.isLoading).toBe(false)
    })

    it('should create an initial data value in the cache via optimistic update', async () => {
        useDataValueSetQueryKey.mockImplementation(() => ['dataValues'])
        const queryCache = new QueryCache()

        const { result: sharedDataValue, waitFor: waitForSharedDataValue } =
            renderHook(
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
        act(() => sharedDataValue.current.mutate({ value: '42' }))
        await waitForSharedDataValue(() => sharedDataValue.current.isSuccess)

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
        const { result: dataValueSet, waitFor: waitForDataValueSet } =
            renderHook(useDataValueSet, {
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
        await waitForDataValueSet(() => dataValueSet.current.isSuccess)

        const initiallyCachedDataValuesQuery = queryCache.find({
            queryKey: ['dataValues'],
        })
        const initiallyCachedDataValues =
            initiallyCachedDataValuesQuery.state.data
        expect(initiallyCachedDataValues.dataValues).toHaveLength(1)
        const [initialDataValue] = initiallyCachedDataValues.dataValues
        expect(initialDataValue.value).toBe('27')

        const { result: sharedDataValue, waitFor: waitForSharedDataValue } =
            renderHook(
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
        act(() => sharedDataValue.current.mutate({ value: '42' }))
        await waitForSharedDataValue(() => sharedDataValue.current.isSuccess)

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
        const { result: dataValueSet, waitFor: waitForDataValueSet } =
            renderHook(useDataValueSet, {
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
                                            value: '27',
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
        await waitForDataValueSet(() => dataValueSet.current.isSuccess)

        const initiallyCachedDataValuesQuery = queryCache.find({
            queryKey: ['dataValues'],
        })
        const initiallyCachedDataValues =
            initiallyCachedDataValuesQuery.state.data
        expect(initiallyCachedDataValues.dataValues).toHaveLength(1)
        const [initialDataValue] = initiallyCachedDataValues.dataValues
        expect(initialDataValue.value).toBe('27')

        const { result: sharedDataValue, waitFor: waitForSharedDataValue } =
            renderHook(
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
        act(() => sharedDataValue.current.mutate({ value: '42' }))
        await waitForSharedDataValue(() => sharedDataValue.current.isSuccess)

        const cachedDataValuesQuery = queryCache.find({
            queryKey: ['dataValues'],
        })
        const cachedDataValues = cachedDataValuesQuery.state.data

        expect(cachedDataValues.dataValues).toHaveLength(1)

        const [newDataValue] = cachedDataValues.dataValues
        expect(newDataValue.value).toBe('42')
    })
})
