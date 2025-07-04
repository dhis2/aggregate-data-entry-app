import { act, renderHook, waitFor } from '@testing-library/react'
import { useEntryFormStore } from './entry-form-store.js'

describe('useEntryFormStore', () => {
    const initialState = useEntryFormStore.getState()

    beforeEach(() => {
        useEntryFormStore.setState(initialState)
    })

    it('should get and set new errors', async () => {
        const { result } = renderHook(useEntryFormStore)

        act(() => {
            result.current.setError('de-id1.coc-id1', 'Error message 1')
        })

        await waitFor(() => {
            const actualError = result.current.getError('de-id1.coc-id1')
            expect(actualError).toBe('Error message 1')
        })
    })

    it('should provide the number of errors', async () => {
        const { result } = renderHook(useEntryFormStore)
        const nextErrors = {
            'de-id1': {
                'coc-id1': 'Error message 1',
                'coc-id2': 'Error message 2',
                'coc-id3': 'Error message 3',
            },
            'de-id2': {
                'coc-id4': 'Error message 4',
                'coc-id5': 'Error message 5',
                'coc-id6': 'Error message 6',
            },
        }

        act(() => {
            for (const de of Object.keys(nextErrors)) {
                for (const coc of Object.keys(nextErrors[de])) {
                    result.current.setError(`${de}.${coc}`, nextErrors[de][coc])
                }
            }
        })

        await waitFor(() => {
            const numberOfErrors = result.current.getNumberOfErrors()
            expect(numberOfErrors).toBe(6)
        })
    })
})
