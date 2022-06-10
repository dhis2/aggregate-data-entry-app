import { createContext } from 'react'

const CurrentItemContext = createContext({
    item: null,
    setItem: () => {
        throw new Error('Current item context has not been initialized yet')
    },
})

export default CurrentItemContext
