import { useContext } from 'react'
import { LockedContext } from './locked-info-context.js'

export function useLockedContext() {
    return useContext(LockedContext)
}
