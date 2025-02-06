import { act, renderHook, waitFor } from '@testing-library/react'
import { useUnsavedDataStore, inititalState } from './unsaved-data-store.js'

jest.mock('zustand/middleware', () => ({
    persist: jest.fn((cb) => cb),
}))

describe('useUnsavedDataStore', () => {
    beforeEach(() => {
        useUnsavedDataStore.setState(inititalState)
    })

    it('should return an unsaved comment', () => {
        useUnsavedDataStore.setState({
            limits: {},
            comments: {
                'aoc-id1;aoc-id2,ds-id,ou-id,2022_de-id_coc-id':
                    'I am a comment',
            },
        })

        const { result } = renderHook(useUnsavedDataStore)

        expect(
            result.current.getUnsavedComment(
                'aoc-id1;aoc-id2,ds-id,ou-id,2022_de-id_coc-id'
            )
        ).toBe('I am a comment')
    })

    it('should set an unsaved comment', async () => {
        const { result } = renderHook(useUnsavedDataStore)

        expect(
            result.current.getUnsavedComment(
                'aoc-id1;aoc-id2,ds-id,ou-id,2022_de-id_coc-id'
            )
        ).toBeUndefined()

        act(() => {
            result.current.setUnsavedComment(
                'aoc-id1;aoc-id2,ds-id,ou-id,2022_de-id_coc-id',
                'I am a comment'
            )
        })

        await waitFor(() => {
            expect(
                result.current.getUnsavedComment(
                    'aoc-id1;aoc-id2,ds-id,ou-id,2022_de-id_coc-id'
                )
            ).toBe('I am a comment')
        })
    })

    it('should delete an unsaved comment', async () => {
        useUnsavedDataStore.setState({
            limits: {},
            comments: {
                'aoc-id1;aoc-id2,ds-id,ou-id,2022_de-id_coc-id':
                    'I am a comment',
            },
        })

        const { result } = renderHook(useUnsavedDataStore)

        expect(
            result.current.getUnsavedComment(
                'aoc-id1;aoc-id2,ds-id,ou-id,2022_de-id_coc-id'
            )
        ).toBe('I am a comment')

        act(() => {
            result.current.deleteUnsavedComment(
                'aoc-id1;aoc-id2,ds-id,ou-id,2022_de-id_coc-id'
            )
        })

        await waitFor(() => {
            expect(
                result.current.getUnsavedComment(
                    'aoc-id1;aoc-id2,ds-id,ou-id,2022_de-id_coc-id'
                )
            ).toBeUndefined()
        })
    })

    it('should return an unsaved limit', () => {
        useUnsavedDataStore.setState({
            comments: {},
            limits: {
                'aoc-id1;aoc-id2,ds-id,ou-id,2022_de-id_coc-id': {
                    min: 1,
                    max: 2,
                },
            },
        })

        const { result } = renderHook(useUnsavedDataStore)

        expect(
            result.current.getUnsavedLimits(
                'aoc-id1;aoc-id2,ds-id,ou-id,2022_de-id_coc-id'
            )
        ).toEqual({ min: 1, max: 2 })
    })

    it('should set an unsaved limit', async () => {
        const { result } = renderHook(useUnsavedDataStore)

        expect(
            result.current.getUnsavedLimits(
                'aoc-id1;aoc-id2,ds-id,ou-id,2022_de-id_coc-id'
            )
        ).toBeUndefined()

        act(() => {
            result.current.setUnsavedLimits(
                'aoc-id1;aoc-id2,ds-id,ou-id,2022_de-id_coc-id',
                { min: 1, max: 2 }
            )
        })

        await waitFor(() => {
            expect(
                result.current.getUnsavedLimits(
                    'aoc-id1;aoc-id2,ds-id,ou-id,2022_de-id_coc-id'
                )
            ).toEqual({ min: 1, max: 2 })
        })
    })

    it('should delete an unsaved limit', async () => {
        useUnsavedDataStore.setState({
            comments: {},
            limits: {
                'aoc-id1;aoc-id2,ds-id,ou-id,2022_de-id_coc-id': {
                    min: 1,
                    max: 2,
                },
            },
        })

        const { result } = renderHook(useUnsavedDataStore)

        expect(
            result.current.getUnsavedLimits(
                'aoc-id1;aoc-id2,ds-id,ou-id,2022_de-id_coc-id'
            )
        ).toEqual({ min: 1, max: 2 })

        act(() => {
            result.current.deleteUnsavedLimits(
                'aoc-id1;aoc-id2,ds-id,ou-id,2022_de-id_coc-id'
            )
        })

        await waitFor(() => {
            expect(
                result.current.getUnsavedLimits(
                    'aoc-id1;aoc-id2,ds-id,ou-id,2022_de-id_coc-id'
                )
            ).toBeUndefined()
        })
    })
})
