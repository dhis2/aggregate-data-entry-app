import { QueryCache } from '@tanstack/react-query'
import { act, renderHook, waitFor } from '@testing-library/react'
import React from 'react'
import { useDataValueSetQueryKey, useDataValueSet } from '../../shared/index.js'
import { dataValueSets } from '../../shared/use-data-value-set/query-key-factory.js'
import { Wrapper } from '../../test-utils/index.js'
import useUpdateLimits from './use-update-limits.js'

jest.mock(
    '../../shared/use-data-value-set/use-data-value-set-query-key.js',
    () => ({
        __esModule: true,
        default: jest.fn(),
    })
)

jest.mock(
    '../../shared/use-context-selection/use-is-valid-selection.js',
    () => ({
        useIsValidSelection: jest.fn(() => true),
    })
)

describe('useUpdateLimits', () => {
    useDataValueSetQueryKey.mockImplementation(() =>
        dataValueSets.byIds({
            dataSetId: 'ds-id',
            periodId: 2022,
            orgUnitId: 'ou-id',
            categoryComboId: 'cc-id',
            categoryOptionIds: ['co-id1', 'co-id2'],
        })
    )

    it('should optimistically update the limits in the cache', async () => {
        const queryCache = new QueryCache()

        // first we need to load the data value set so we have an entry for min-max values
        const { result: dataValueSet } = renderHook(useDataValueSet, {
            wrapper: ({ children }) => (
                <Wrapper
                    queryClientOptions={{ queryCache }}
                    dataForCustomProvider={{
                        'dataEntry/dataValues': () => {
                            return Promise.resolve({
                                minMaxValues: [
                                    {
                                        categoryOptionCombo:
                                            'category-option-combo-id',
                                        dataElement: 'data-element-id',
                                        orgUnit: 'orgUnitId',
                                        minValue: 3,
                                        maxValue: 4,
                                    },
                                ],
                            })
                        },
                    }}
                >
                    {children}
                </Wrapper>
            ),
        })

        // we need to wait for the initial data values to have been fetched
        // (and therefore cached)
        await waitFor(() => {
            expect(
                dataValueSet.current.isSuccess || dataValueSet.current.isError
            ).toBeTrue()
        })

        // extract the cached values and make an assertion
        const dataValueSetQueryKey = dataValueSets.byIds({
            dataSetId: 'ds-id',
            periodId: 2022,
            orgUnitId: 'ou-id',
            categoryComboId: 'cc-id',
            categoryOptionIds: ['co-id1', 'co-id2'],
        })
        const initialDataValuesQuery = queryCache.find({
            queryKey: dataValueSetQueryKey,
        })
        const initialDataValuesQueryData = initialDataValuesQuery.state.data

        expect(initialDataValuesQueryData).toEqual({
            minMaxValues: [
                {
                    categoryOptionCombo: 'category-option-combo-id',
                    dataElement: 'data-element-id',
                    orgUnit: 'orgUnitId',
                    minValue: 3,
                    maxValue: 4,
                },
            ],
        })

        // Now update the limits and wait until it's done
        const { result } = renderHook(useUpdateLimits, {
            wrapper: ({ children }) => (
                <Wrapper
                    queryClientOptions={{ queryCache }}
                    dataForCustomProvider={{ 'dataEntry/minMaxValues': {} }}
                >
                    {children}
                </Wrapper>
            ),
        })

        act(() => {
            result.current.mutate({
                categoryOptionCombo: 'category-option-combo-id',
                dataElement: 'data-element-id',
                orgUnit: 'orgUnitId',
                minValue: 2,
                maxValue: 3,
            })
        })

        await waitFor(() => result.current.isSuccess)

        // It should have updated the values in the cache
        const dataValuesQuery = queryCache.find({
            queryKey: dataValueSetQueryKey,
        })
        const dataValuesQueryData = dataValuesQuery.state.data

        expect(dataValuesQueryData).toEqual({
            minMaxValues: [
                {
                    categoryOptionCombo: 'category-option-combo-id',
                    dataElement: 'data-element-id',
                    orgUnit: 'orgUnitId',
                    minValue: 2,
                    maxValue: 3,
                },
            ],
        })
    })

    it('should revert the optimistic update when there is an error', async () => {
        const queryCache = new QueryCache()

        // first we need to load the data value set so we have an entry for min-max values
        const { result: dataValueSet } = renderHook(useDataValueSet, {
            wrapper: ({ children }) => (
                <Wrapper
                    queryClientOptions={{ queryCache }}
                    dataForCustomProvider={{
                        'dataEntry/dataValues': () => {
                            return Promise.resolve({
                                minMaxValues: [
                                    {
                                        categoryOptionCombo:
                                            'category-option-combo-id',
                                        dataElement: 'data-element-id',
                                        orgUnit: 'orgUnitId',
                                        minValue: 3,
                                        maxValue: 4,
                                    },
                                ],
                            })
                        },
                    }}
                >
                    {children}
                </Wrapper>
            ),
        })

        // we need to wait for the initial data values to have been fetched
        // (and therefore cached)
        await waitFor(() => {
            expect(
                dataValueSet.current.isSuccess || dataValueSet.current.isError
            ).toBeTrue()
        })

        // extract the cached values and make an assertion
        const dataValueSetQueryKey = dataValueSets.byIds({
            dataSetId: 'ds-id',
            periodId: 2022,
            orgUnitId: 'ou-id',
            categoryComboId: 'cc-id',
            categoryOptionIds: ['co-id1', 'co-id2'],
        })
        const initialDataValuesQuery = queryCache.find({
            queryKey: dataValueSetQueryKey,
        })
        const initialDataValuesQueryData = initialDataValuesQuery.state.data

        expect(initialDataValuesQueryData).toEqual({
            minMaxValues: [
                {
                    categoryOptionCombo: 'category-option-combo-id',
                    dataElement: 'data-element-id',
                    orgUnit: 'orgUnitId',
                    minValue: 3,
                    maxValue: 4,
                },
            ],
        })

        const { result } = renderHook(useUpdateLimits, {
            wrapper: ({ children }) => (
                <Wrapper
                    queryClientOptions={{ queryCache }}
                    dataForCustomProvider={{
                        'dataEntry/minMaxValues': () =>
                            Promise.reject(new Error('Custom error')),
                    }}
                >
                    {children}
                </Wrapper>
            ),
        })

        act(() => {
            result.current.mutate({
                categoryOptionCombo: 'category-option-combo-id',
                dataElement: 'data-element-id',
                orgUnit: 'orgUnitId',
                minValue: 2,
                maxValue: 3,
            })
        })

        await waitFor(() => result.current.isError)

        const dataValuesQuery = queryCache.find({
            queryKey: dataValueSetQueryKey,
        })
        const dataValuesQueryData = dataValuesQuery.state.data

        // The original value is `undefined`, but `queryClient.setQueryData`
        // doesn't work with `undefined` as a value, so it has to be set to an
        // empty object instead
        expect(dataValuesQueryData).toEqual({
            minMaxValues: [
                {
                    categoryOptionCombo: 'category-option-combo-id',
                    dataElement: 'data-element-id',
                    orgUnit: 'orgUnitId',
                    minValue: 3,
                    maxValue: 4,
                },
            ],
        })
    })

    it('should pass the correct data to the data engine', async () => {
        const queryCache = new QueryCache()
        const minMaxValuesResolver = jest.fn(() =>
            Promise.resolve({ min: 3, max: 4 })
        )

        const { result } = renderHook(useUpdateLimits, {
            wrapper: ({ children }) => (
                <Wrapper
                    queryClientOptions={{ queryCache }}
                    dataForCustomProvider={{
                        'dataEntry/minMaxValues': minMaxValuesResolver,
                    }}
                >
                    {children}
                </Wrapper>
            ),
        })

        act(() => {
            result.current.mutate({
                categoryOptionCombo: 'category-option-combo-id',
                dataElement: 'data-element-id',
                orgUnit: 'org-unit-id',
                minValue: 2,
                maxValue: 3,
            })
        })

        await waitFor(() => result.current.isSuccess)

        // Not an ideal way to test this, but I'm not sure if there's
        // any other way to test whether the correct query has been
        // constructed and passed to the data engine
        const [method, query] = minMaxValuesResolver.mock.calls[0]
        expect(method).toBe('create')
        expect(query).toEqual({
            resource: 'dataEntry/minMaxValues',
            data: {
                dataElement: 'data-element-id',
                orgUnit: 'org-unit-id',
                categoryOptionCombo: 'category-option-combo-id',
                minValue: 2,
                maxValue: 3,
            },
        })
    })
})
