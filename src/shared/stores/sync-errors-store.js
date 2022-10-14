import create from 'zustand'
import { parseCellId, getCellIdFromMutationKey } from './get-cell-id.js'

const inititalState = {
    // keyed by cellId, see getCellId
    errors: {},
}

export const useSyncErrorsStore = create((set, get) => ({
    ...inititalState,
    setError: (cellId, value) =>
        set((state) => {
            const comments = { ...state.comments }
            comments[cellId] = value
            return { comments }
        }),
    setErrorByMutationKey: (mutationKey, value) => {
        const cellId = getCellIdFromMutationKey(mutationKey)
        get().setError(cellId, value)
    },
    getErrors: () => get().errors,
    getError: (cellId) => get().errors[cellId],
    getErrorByMutationKey: (mutationKey) =>
        get().getError(getCellIdFromMutationKey(mutationKey)),
    getErrorsForSelection: (contextSelectionId) => {
        const errors = get().getErrors()
        return Object.entries(errors)
            .filter(([key]) => key.startsWith(contextSelectionId))
            .map(([key, error]) => {
                const fieldId = parseCellId(key)
                return {
                    fieldId,
                    error,
                }
            })
    },
}))
