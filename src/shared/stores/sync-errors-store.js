import create from 'zustand'
import {
    parseCellId,
    getCellIdFromMutationKey,
    getCellIdFromDataValueParams,
} from './get-cell-id.js'

const inititalState = {
    // keyed by cellId, see getCellId
    errors: {},
}

// API for stored errors
export const createSyncError = (error, value, mutationKey) => {
    return {
        error,
        value,
        mutationKey,
    }
}

export const useSyncErrorsStore = create((set, get) => ({
    ...inititalState,
    setErrorById: (cellId, error) =>
        set((state) => {
            const errors = { ...state.errors }
            errors[cellId] = error
            console.log('setting error', cellId, errors)
            return { errors }
        }),
    setErrorByMutationKey: (mutationKey, error) => {
        const cellId = getCellIdFromMutationKey(mutationKey)
        get().setErrorById(cellId, error)
    },
    setError: (apiMutationError) => {
        const cellId = getCellIdFromMutationKey(apiMutationError.mutationKey)
        get().setErrorById(cellId, apiMutationError)
    },

    clearErrorById: (cellId) =>
        set((state) => {
            const errors = { ...state.errors }
            delete errors[cellId]
            return { errors }
        }),
    clearErrorByMutationKey: (mutationKey) => {
        const cellId = getCellIdFromMutationKey(mutationKey)
        get().clearErrorById(cellId)
    },
    clearAll: () => set(inititalState),

    getErrors: () => get().errors,
    getErrorById: (cellId) => get().getErrors()[cellId],
    getErrorByDataValueParams: (dataValueParams) =>
        get().getErrorById(getCellIdFromDataValueParams(dataValueParams)),
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
