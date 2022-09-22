import create from 'zustand'
import { persist } from 'zustand/middleware'

const inititalState = {
    unsavedComments: {},
    unsavedLimits: {},
}

export const useUnsavedDataStore = create(
    persist((set, get) => ({
        ...inititalState,
        setUnsavedComment: (cellId, value) =>
            set((state) => {
                const unsavedComments = { ...state.unsavedComments }
                unsavedComments[cellId] = value
                return { unsavedComments }
            }),
        getUnsavedComment: (cellId) => {
            return get().unsavedComments[cellId]
        },
    }))
)

export const getCellId = ({
    contextSelectionId,
    item: { categoryOptionCombo, dataElement },
}) => `${contextSelectionId}_${dataElement}_${categoryOptionCombo}`
