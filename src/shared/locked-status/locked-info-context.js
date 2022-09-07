import { createContext } from 'react'

export const LockedContext = createContext({
    // sets above properties
    setLockStatus: () => {
        throw new Error('Context function "setLockStatus" not set')
    },
})
