import { createContext } from 'react'

export const LockedContext = createContext({
    // message for warning box
    message: '',

    // whether warning box is error
    error: false,

    // title for warning box
    title: '',

    // whether the warning box should be display inside the form
    inForm: false,

    // whether the form is in a locked state
    locked: false,

    // sets above properties
    setLockedStatus: () => {
        throw new Error('Context function "setLockedStatus" not set')
    },
})
