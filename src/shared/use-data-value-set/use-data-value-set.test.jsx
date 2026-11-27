import { renderHook, waitFor } from '@testing-library/react'
import React from 'react'
import { Wrapper } from '../../test-utils/index.js'
import { EmbeddedContext } from '../embedded/index.js'
import useDataValueSetQueryKey from './use-data-value-set-query-key.js'
import { useDataValueSet } from './use-data-value-set.js'

jest.mock('./use-data-value-set-query-key.js', () => ({
    __esModule: true,
    default: jest.fn(() => ['dataEntry/dataValues']),
}))

jest.mock('../use-context-selection/use-is-valid-selection.js', () => ({
    useIsValidSelection: jest.fn(() => true),
}))

const renderWithHostValues = (hostDataValues, dataValuesResolver) =>
    renderHook(useDataValueSet, {
        wrapper: ({ children }) => (
            <Wrapper
                dataForCustomProvider={{
                    'dataEntry/dataValues': dataValuesResolver,
                }}
            >
                <EmbeddedContext.Provider
                    value={{ dataValues: hostDataValues }}
                >
                    {children}
                </EmbeddedContext.Provider>
            </Wrapper>
        ),
    })

describe('useDataValueSet', () => {
    it('shows the values from an embedding app without fetching any', async () => {
        const dataValuesResolver = jest.fn(() => ({ dataValues: [] }))
        const { result } = renderWithHostValues(
            {
                dataValues: [
                    {
                        dataElement: 'de1',
                        categoryOptionCombo: 'coc1',
                        value: '12',
                    },
                ],
            },
            dataValuesResolver
        )

        await waitFor(() => expect(result.current.isSuccess).toBe(true))
        expect(result.current.data.dataValues).toEqual({
            de1: {
                coc1: {
                    dataElement: 'de1',
                    categoryOptionCombo: 'coc1',
                    value: '12',
                },
            },
        })
        expect(dataValuesResolver).not.toHaveBeenCalled()
    })

    it('fills in what an embedding app leaves out', async () => {
        const { result } = renderWithHostValues({ dataValues: [] }, jest.fn())

        await waitFor(() => expect(result.current.isSuccess).toBe(true))
        // read by every number field
        expect(result.current.data.minMaxValues).toEqual([])
        expect(result.current.data.completeStatus).toEqual({ complete: false })
    })

    it('fetches the values without an embedding app', async () => {
        // a selection the other tests haven't cached
        useDataValueSetQueryKey.mockReturnValue([
            'dataEntry/dataValues',
            { params: { pe: '202402' } },
        ])
        const dataValuesResolver = jest.fn(() => ({ dataValues: [] }))
        const { result } = renderWithHostValues(undefined, dataValuesResolver)

        await waitFor(() => expect(result.current.isSuccess).toBe(true))
        expect(dataValuesResolver).toHaveBeenCalledTimes(1)
    })
})
