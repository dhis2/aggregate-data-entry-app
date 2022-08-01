import { createContext } from 'react'

export const RightHandPanelContext = createContext({
    // used to identify which sidebar content should be displayed
    id: '',

    // used to know whether the form content has changed while the right hand panel was open
    formChangedSincePanelOpened: false,

    // used to set the id, which will automatically show the sidebar
    show: (id) => {
        throw new Error(
            `Context function "show" not set, tried to show id "${id}"`
        )
    },

    // used to hide the sidebar, should unset the id
    hide: () => {
        throw new Error('Context function "hide" not set')
    },

    setFormChangedSincePanelOpened: () => {
        throw new Error(
            'Context function "setFormChangedSincePanelOpened" not set'
        )
    },
})

export const SetRightHandPanelContext = createContext((id) => {
    throw new Error(`Context function "show" not set, tried to show id "${id}"`)
})
