import { act, renderHook } from '@testing-library/react-hooks'
import { useEntryFormStore } from './entry-form-store.js'

describe('useEntryFormStore', () => {
    const initialState = useEntryFormStore.getState()

    beforeEach(() => {
        useEntryFormStore.setState(initialState)
    })

    it('should accept new errors', async () => {
        const { result, waitFor } = renderHook(useEntryFormStore)
        const nextErrors = {
            'de-id': { 'coc-id': 'Error message' },
        }

        act(() => {
            result.current.setErrors(nextErrors)
        })

        await waitFor(() => {
            const errors = result.current.getErrors()
            expect(errors).toBe(nextErrors)
        })
    })

    it('should provide the number of errors', async () => {
        const { result, waitFor } = renderHook(useEntryFormStore)
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
            result.current.setErrors(nextErrors)
        })

        await waitFor(() => {
            const numberOfErrors = result.current.getNumberOfErrors()
            expect(numberOfErrors).toBe(6)
        })
    })
})
