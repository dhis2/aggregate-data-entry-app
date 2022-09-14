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

// errors object is the same shape as form-Values
// eg. { [dataElementId] : {
//         [categoryOptionComboId]: "error message"
//       }
//     }
// so we just count the number of leaves in the object to get number of errors
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
