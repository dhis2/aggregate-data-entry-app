import create from 'zustand'

const inititalState = {
    errors: {},
}

export const useEntryFormStore = create((set, get) => ({
    ...inititalState,
    setErrors: (errors) => set({ errors: errors ?? {} }),
    getErrors: () => get().errors,
    getNumberOfErrors: () => countLeaves(get().getErrors()),
}))

function countLeaves(object) {
    // base case
    if (Array.isArray(object) || typeof object !== 'object') {
        return 1
    } else {
        return Object.values(object).reduce(
            (acc, curr) => acc + countLeaves(curr),
            0
        )
    }
}
