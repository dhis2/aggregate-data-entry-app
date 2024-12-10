import { setIn, getIn } from 'final-form'
import create from 'zustand'

const inititalState = {
    errors: {},
    warnings: {},
    completeAttempted: false,
}

export const useEntryFormStore = create((set, get) => {
    return {
        ...inititalState,
        getErrors: () => get().errors,
        getNumberOfErrors: () => countLeaves(get().getErrors()),
        getError: (fieldname) => getIn(get().getErrors(), fieldname),
        setError: (fieldname, error) => {
            const errors = get().getErrors()
            // setIn from final-form is used to create the same structure as errors
            const newErrors = setIn(errors, fieldname, error) ?? {}
            set({ errors: newErrors })
        },
        getWarnings: () => get().warnings,
        getWarning: (fieldname) => getIn(get().getWarnings(), fieldname),
        setWarning: (fieldname, warning) => {
            const warnings = get().getWarnings()
            // setIn from final-form is used to create the same structure as errors
            const newWarnings = setIn(warnings, fieldname, warning) ?? {}
            set({ warnings: newWarnings })
        },
        getCompleteAttempted: () => get().completeAttempted,
        setCompleteAttempted: (bool) => set({ completeAttempted: bool }),
        // could add getNumberOfWarnings if needed
    }
})

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
