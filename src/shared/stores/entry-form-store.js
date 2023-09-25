import { setIn, getIn } from 'final-form'
import create from 'zustand'
import { devtools } from 'zustand/middleware'
const inititalState = {
    errors: {},
    warnings: {},
}

export const useEntryFormStore = create(
    devtools((set, get) => ({
        ...inititalState,
        setErrors: (errors) => set({ errors: errors ?? {} }),
        getErrors: () => get().errors,
        getNumberOfErrors: () => countLeaves(get().getErrors()),
        getWarnings: () => get().warnings,
        getWarning: (fieldname) => getIn(get().getWarnings(), fieldname),
        setWarning: (fieldname, warning) => {
            const warnings = get().getWarnings() || {}
            const newWarnings = setIn(warnings, fieldname, warning)
            set({ warnings: newWarnings })
        },
    }))
)

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
