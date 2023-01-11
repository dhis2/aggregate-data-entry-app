import { act, renderHook } from '@testing-library/react-hooks'
import React from 'react'
import { useDataValueSetQueryKey } from '../../shared/index.js'
import { dataValueSets } from '../../shared/use-data-value-set/query-key-factory.js'
import { Wrapper, useTestQueryClient } from '../../test-utils/index.js'
import useUpdateLimits from './use-update-limits.js'

jest.mock(
    '../../shared/use-data-value-set/use-data-value-set-query-key.js',
    () => ({
        __esModule: true,
        default: jest.fn(),
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

    function createQueryClient() {
        // There is no other way of getting the query client right now.
        // The reason is: There is no way to manualy create a new data engine
        // instance (from @dhis2/app-runtime) because the class is not being
        // exported.
        const {
            result: { current: queryClient },
        } = renderHook(useTestQueryClient)
        return queryClient
    }

    it('should optimistically update the limits in the cache', async () => {
        const queryClient = createQueryClient()
        const { result, waitFor } = renderHook(useUpdateLimits, {
            wrapper: ({ children }) => (
                <Wrapper
                    queryClient={queryClient}
                    dataForCustomProvider={{
                        'dataEntry/minMaxValues': { min: 3, max: 4 },
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

        await waitFor(() => result.current.isSuccess)

        const dataValueSetQueryKey = dataValueSets.byIds({
            dataSetId: 'ds-id',
            periodId: 2022,
            orgUnitId: 'ou-id',
            categoryComboId: 'cc-id',
            categoryOptionIds: ['co-id1', 'co-id2'],
        })
        const dataValuesQuery = queryClient.queryCache.find({
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
        const queryClient = createQueryClient()
        const { result, waitFor } = renderHook(useUpdateLimits, {
            wrapper: ({ children }) => (
                <Wrapper
                    queryClient={queryClient}
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

        const dataValueSetQueryKey = dataValueSets.byIds({
            dataSetId: 'ds-id',
            periodId: 2022,
            orgUnitId: 'ou-id',
            categoryComboId: 'cc-id',
            categoryOptionIds: ['co-id1', 'co-id2'],
        })
        const dataValuesQuery = queryClient.queryCache.find({
            queryKey: dataValueSetQueryKey,
        })
        const dataValuesQueryData = dataValuesQuery.state.data

        // The original value is `undefined`, but `queryClient.setQueryData`
        // doesn't work with `undefined` as a value, so it has to be set to an
        // empty object instead
        expect(dataValuesQueryData).toEqual({})
    })

    it('should pass the correct data to the data engine', async () => {
        const minMaxValuesResolver = jest.fn(() =>
            Promise.resolve({ min: 3, max: 4 })
        )
        const queryClient = createQueryClient()
        const { result, waitFor } = renderHook(useUpdateLimits, {
            wrapper: ({ children }) => (
                <Wrapper
                    queryClient={queryClient}
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
