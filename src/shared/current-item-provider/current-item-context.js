import { createContext } from 'react'

export const CurrentItemContext = createContext({
    item: null,
    setItem: () => {
        throw new Error('Current item context has not been initialized yet')
    },
})

export const SetCurrentItemContext = createContext(() => {
    throw new Error('Current item context has not been initialized yet')
})
