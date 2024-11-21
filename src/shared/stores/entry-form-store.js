import { setIn, getIn } from 'final-form'
import create from 'zustand'

const inititalState = {
    errors: {},
    warnings: {},
    individualErrors: {},
}

export const useEntryFormStore = create((set, get) => {
    return {
        ...inititalState,
        setErrors: (errors) => set({ errors: errors ?? {} }),
        getErrors: () => get().errors,
        getError: (fieldname) => getIn(get().getErrors(), fieldname),
        getNumberOfErrors: () => countLeaves(get().getIndividualErrors()),
        getIndividualErrors: () => get().individualErrors,
        getIndividualError: (fieldname) =>
            getIn(get().getIndividualErrors(), fieldname),
        setIndividualError: (fieldname, error) => {
            const errors = get().getIndividualErrors()
            // setIn from final-form is used to create the same structure as errors
            const newErrors = setIn(errors, fieldname, error) ?? {}
            set({ individualErrors: newErrors })
        },
        getWarnings: () => get().warnings,
        getWarning: (fieldname) => getIn(get().getWarnings(), fieldname),
        setWarning: (fieldname, warning) => {
            const warnings = get().getWarnings()
            // setIn from final-form is used to create the same structure as errors
            const newWarnings = setIn(warnings, fieldname, warning) ?? {}
            set({ warnings: newWarnings })
        },
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
