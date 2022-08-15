import { createContext } from 'react'

export const HighlightedFieldIdContext = createContext({
    item: null,
    setItem: () => {
        throw new Error('Current item context has not been initialized yet')
    },
})

export const SetHighlightedFieldIdContext = createContext(() => {
    throw new Error('Current item context has not been initialized yet')
})
