import { createContext } from 'react'

export default createContext({
    // used to know whether the form content has changed while the right hand panel was open
    formChangedSincePanelOpened: false,

    setFormChangedSincePanelOpened: () => {
        throw new Error(
            'Context function "setFormChangedSincePanelOpened" not set'
        )
    },
})
