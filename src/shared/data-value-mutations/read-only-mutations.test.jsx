import { act, renderHook } from '@testing-library/react'
import React from 'react'
import { Wrapper } from '../../test-utils/index.js'
import { ReadOnlyContext } from '../embedded/index.js'
import {
    useDeleteDataValueMutation,
    useSetDataValueMutation,
    useUploadFileDataValueMutation,
} from './data-value-mutations.js'

jest.mock('../use-data-value-set/use-data-value-set-query-key.js', () => ({
    __esModule: true,
    default: jest.fn(() => ['dataValues']),
}))

const renderReadOnly = (useMutationHook, dataValuesResolver) =>
    renderHook(() => useMutationHook({ deId: 'de-id', cocId: 'coc-id' }), {
        wrapper: ({ children }) => (
            <ReadOnlyContext.Provider value={true}>
                <Wrapper
                    dataForCustomProvider={{ dataValues: dataValuesResolver }}
                >
                    {children}
                </Wrapper>
            </ReadOnlyContext.Provider>
        ),
    })

describe('data value mutations in a read-only form', () => {
    it.each([
        ['setting', useSetDataValueMutation, { value: '42' }],
        ['clearing', useSetDataValueMutation, { value: '' }],
        ['deleting', useDeleteDataValueMutation, undefined],
        ['uploading', useUploadFileDataValueMutation, { file: {} }],
    ])('never send anything when %s a value', async (_, hook, variables) => {
        const dataValuesResolver = jest.fn(() => Promise.resolve({}))
        const { result } = renderReadOnly(hook, dataValuesResolver)

        act(() => result.current.mutate(variables))
        await act(() => result.current.mutateAsync(variables))

        expect(dataValuesResolver).not.toHaveBeenCalled()
        expect(result.current.isIdle).toBe(true)
    })
})
