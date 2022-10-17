import create from 'zustand'

const inititalState = {
    validationToRefresh: false,
}

export const useValidationStore = create((set, get) => ({
    ...inititalState,
    setValidationToRefresh: (validationToRefresh) =>
        set({ validationToRefresh }),
    getValidationToRefresh: () => get().validationToRefresh,
}))
