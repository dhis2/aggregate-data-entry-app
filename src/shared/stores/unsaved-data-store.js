import create from 'zustand'
import { persist } from 'zustand/middleware'

const inititalState = {
    comments: {},
    limits: {},
}

export const useUnsavedDataStore = create(
    persist((set, get) => ({
        ...inititalState,
        setUnsavedComment: (cellId, value) =>
            set((state) => {
                const comments = { ...state.comments }
                comments[cellId] = value
                return { comments }
            }),
        deleteUnsavedComment: (cellId) =>
            set((state) => {
                const comments = { ...state.comments }
                delete comments[cellId]
                return { comments }
            }),
        getUnsavedComment: (cellId) => {
            return get().comments[cellId]
        },
        setUnsavedLimits: (cellId, value) =>
            set((state) => {
                const limits = { ...state.limits }
                limits[cellId] = value
                return { limits }
            }),

        deleteUnsavedLimits: (cellId) =>
            set((state) => {
                const limits = { ...state.limits }
                delete limits[cellId]
                return { limits }
            }),

        getUnsavedLimits: (cellId) => {
            return get().limits[cellId]
        },
    }))
)

export const getCellId = ({
    contextSelectionId,
    item: { categoryOptionCombo, dataElement },
}) => `${contextSelectionId}_${dataElement}_${categoryOptionCombo}`
