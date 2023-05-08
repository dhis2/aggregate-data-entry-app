import { QueryCache } from '@tanstack/react-query'
import { act, renderHook } from '@testing-library/react-hooks'
import React from 'react'
import { Wrapper } from '../../test-utils/index.js'
import { useDataValueSet } from '../use-data-value-set/index.js'
import { useSetFormCompletionMutation } from './use-set-form-completion-mutation.js'

jest.mock('../use-data-value-set/use-data-value-set-query-key.js', () => ({
    __esModule: true,
    default: jest.fn(() => ['dataValues']),
}))

jest.mock(
    '../../shared/use-context-selection/use-is-valid-selection.js',
    () => ({
        useIsValidSelection: jest.fn(() => true),
    })
)

jest.mock('./use-set-form-completion-mutation-key.js', () => ({
    __esModule: true,
    default: jest.fn(() => ['dataEntry/dataSetCompletion', {}]),
}))

describe('useSetFormCompletionMutation', () => {
    it('should cancel active data value set queries', async () => {
        const queryCache = new QueryCache()
        const onDataValueSuccess = jest.fn()
        const dataValuesResolver = jest.fn(() => new Promise(() => null))

        // first we need to load the data value set so we have a loading state
        const { result: dataValueSet, waitFor: waitForDataValueSet } =
            renderHook(
                () => useDataValueSet({ onSuccess: onDataValueSuccess }),
                {
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
                }
            )

        // Make sure the request is on-going
        await waitForDataValueSet(() => {
            expect(dataValuesResolver).toHaveBeenCalledTimes(1)
            expect(onDataValueSuccess).toHaveBeenCalledTimes(0)
            return dataValueSet.current.isLoading
        })

        const { result: setFormCompletion, waitFor: waitForSetFormCompletion } =
            renderHook(() => useSetFormCompletionMutation(), {
                wrapper: ({ children }) => (
                    <Wrapper
                        queryClientOptions={{ queryCache }}
                        dataForCustomProvider={{
                            // never resolving
                            'dataEntry/dataSetCompletion': () =>
                                new Promise(() => null),
                        }}
                    >
                        {children}
                    </Wrapper>
                ),
            })

        expect(dataValueSet.current.isLoading).toBe(true)

        // Complete a form
        act(() => setFormCompletion.current.mutate({ completed: true }))

        await waitForSetFormCompletion(() => {
            expect(setFormCompletion.current.isLoading).toBe(true)
        })

        // Ensure that the on-going data value set request is cancelled
        await waitForDataValueSet(() => {
            // We're still waiting for the form completion response, so it's
            // guaranteed that the data value set query hasn't been retriggered
            // yet
            expect(setFormCompletion.current.isLoading).toBe(true)
            expect(dataValuesResolver).toHaveBeenCalledTimes(1)

            // useDataValueSet is not loading but never has finished, which
            // verifies that the active query has been cancelled
            expect(dataValueSet.current.isLoading).toBe(false)
            expect(onDataValueSuccess).toHaveBeenCalledTimes(0)
        })
    })

    it('should optimistically update the completion state', async () => {
        const queryCache = new QueryCache()

        const { result: setFormCompletion, waitFor: waitForSetFormCompletion } =
            renderHook(() => useSetFormCompletionMutation(), {
                wrapper: ({ children }) => (
                    <Wrapper
                        queryClientOptions={{ queryCache }}
                        dataForCustomProvider={{
                            // never resolving
                            'dataEntry/dataSetCompletion': () =>
                                new Promise(() => null),
                        }}
                    >
                        {children}
                    </Wrapper>
                ),
            })

        // Mutate a current data value
        act(() => setFormCompletion.current.mutate({ completed: true }))

        await waitForSetFormCompletion(() => {
            expect(setFormCompletion.current.isLoading).toBe(true)
        })

        // Ensure that the on-going data value set request is cancelled
        const queryKey = ['dataValues']
        const cachedDataValuesQuery = queryCache.find({ queryKey })
        const cachedDataValues = cachedDataValuesQuery.state.data

        expect(cachedDataValues.completeStatus.complete).toBe(true)
    })

    it('should revert to the old cache state when an error occurs', async () => {
        const queryCache = new QueryCache()
        const onDataValueSuccess = jest.fn()
        const dataValuesResolver = jest.fn(() => new Promise(() => null))

        // first we need to load the data value set so we have a loading state
        const { result: dataValueSet, waitFor: waitForDataValueSet } =
            renderHook(
                () => useDataValueSet({ onSuccess: onDataValueSuccess }),
                {
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
                }
            )

        // Make sure the request is on-going
        await waitForDataValueSet(() => {
            expect(dataValuesResolver).toHaveBeenCalledTimes(1)
            expect(onDataValueSuccess).toHaveBeenCalledTimes(0)
            return dataValueSet.current.isLoading
        })

        const { result: setFormCompletion, waitFor: waitForSetFormCompletion } =
            renderHook(() => useSetFormCompletionMutation(), {
                wrapper: ({ children }) => (
                    <Wrapper
                        queryClientOptions={{ queryCache }}
                        dataForCustomProvider={{
                            'dataEntry/dataSetCompletion': () =>
                                new Promise((_, reject) => {
                                    setTimeout(
                                        () => reject(new Error('foo')),
                                        1000
                                    )
                                }),
                        }}
                    >
                        {children}
                    </Wrapper>
                ),
            })

        expect(dataValueSet.current.isLoading).toBe(true)

        jest.useFakeTimers()

        // Mutate a current data value
        act(() => setFormCompletion.current.mutate({ completed: true }))

        jest.advanceTimersByTime(500)

        await waitForSetFormCompletion(() => {
            expect(setFormCompletion.current.isLoading).toBe(true)
        })

        await waitForDataValueSet(() => {
            const queryKey = ['dataValues']
            const cachedDataValuesQuery = queryCache.find({ queryKey })
            const cachedDataValues = cachedDataValuesQuery.state.data
            expect(cachedDataValues.completeStatus.complete).toBe(true)
        })

        jest.advanceTimersByTime(1000)

        // For some reason tests will fail if we don't do this here
        jest.useRealTimers()

        await waitForSetFormCompletion(() => {
            expect(setFormCompletion.current.isError).toBe(true)
        })

        // Ensure that the on-going data value set request is cancelled
        await waitForDataValueSet(() => {
            const queryKey = ['dataValues']
            const cachedDataValuesQuery = queryCache.find({ queryKey })
            const cachedDataValues = cachedDataValuesQuery.state.data
            expect(cachedDataValues.completeStatus).toBeUndefined()
        })
    })
})
