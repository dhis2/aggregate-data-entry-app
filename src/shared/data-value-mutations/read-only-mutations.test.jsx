import { act, renderHook } from '@testing-library/react'
import React from 'react'
import useDeleteLimits from '../../data-workspace/min-max-limits-mutations/use-delete-limits.js'
import useUpdateLimits from '../../data-workspace/min-max-limits-mutations/use-update-limits.js'
import { Wrapper } from '../../test-utils/index.js'
import { useSetFormCompletionMutation } from '../completion/use-set-form-completion-mutation.js'
import { EmbeddedContext } from '../embedded/index.js'
import {
    useDeleteDataValueMutation,
    useSetDataValueMutation,
    useUploadFileDataValueMutation,
} from './data-value-mutations.js'

jest.mock('../use-data-value-set/use-data-value-set-query-key.js', () => ({
    __esModule: true,
    default: jest.fn(() => ['dataValues']),
}))

jest.mock('../completion/use-set-form-completion-mutation-key.js', () => ({
    __esModule: true,
    default: jest.fn(() => ['dataEntry/dataSetCompletion', {}]),
}))

const renderReadOnly = (useMutationHook, resolvers) =>
    renderHook(() => useMutationHook({ deId: 'de-id', cocId: 'coc-id' }), {
        wrapper: ({ children }) => (
            <EmbeddedContext.Provider value={{ readOnly: true }}>
                <Wrapper dataForCustomProvider={resolvers}>{children}</Wrapper>
            </EmbeddedContext.Provider>
        ),
    })

describe('mutations in a read-only form', () => {
    it.each([
        ['setting a value', useSetDataValueMutation, { value: '42' }],
        ['clearing a value', useSetDataValueMutation, { value: '' }],
        ['deleting a value', useDeleteDataValueMutation, undefined],
        ['uploading a file', useUploadFileDataValueMutation, { file: {} }],
        [
            'completing the form',
            useSetFormCompletionMutation,
            { completed: true },
        ],
        ['updating limits', useUpdateLimits, { minValue: 1, maxValue: 2 }],
        ['deleting limits', useDeleteLimits, {}],
    ])('never send anything when %s', async (_, hook, variables) => {
        const resolver = jest.fn(() => Promise.resolve({}))
        const { result } = renderReadOnly(hook, {
            dataValues: resolver,
            'dataEntry/dataSetCompletion': resolver,
            'dataEntry/minMaxValues': resolver,
        })

        act(() => result.current.mutate(variables))
        await act(() => result.current.mutateAsync(variables))

        expect(resolver).not.toHaveBeenCalled()
        expect(result.current.isIdle).toBe(true)
    })
})
