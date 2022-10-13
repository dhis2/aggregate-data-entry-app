import create from 'zustand'
import {
    getContextSelectionId,
    parseContextSelectionId,
} from '../use-context-selection/use-context-selection.js'

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
        const cellId = getCellIdFromDataValueParams(mutationKey[1])
        get().setError(cellId, value)
    },
    getErrors: () => get().errors,
    getError: (cellId) => get().errors[cellId],
    getErrorByMutationKey: (mutationKey) =>
        get().getError(getCellIdFromDataValueParams(mutationKey[1])),
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

export const getCellId = ({
    contextSelectionId,
    item: { categoryOptionCombo, dataElement },
}) => `${contextSelectionId}_${dataElement}_${categoryOptionCombo}`

const parseCellId = (cellId) => {
    const [contextSelectionId, dataElement, categoryOptionCombo] =
        cellId.split('_')
    const parsedContextSelectionId = parseContextSelectionId(contextSelectionId)
    return {
        ...parsedContextSelectionId,
        dataElement,
        categoryOptionCombo,
    }
}

export const getCellIdFromDataValueParams = (params) => {
    const contextSelectionId = getContextSelectionId({
        attributeOptions: params.co.split(';'),
        dataSetId: params.ds,
        orgUnitId: params.ou,
        periodId: params.ps,
    })
    return getCellId({
        contextSelectionId,
        item: { categoryOptionCombo: params.co, dataElement: params.de },
    })
}
