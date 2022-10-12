import { createContext } from 'react'

export const LockedContext = createContext({
    lockStatus: '',
    locked: '',
    setLockStatus: () => {
        throw new Error('Context function "setLockStatus" not set')
    },
})
