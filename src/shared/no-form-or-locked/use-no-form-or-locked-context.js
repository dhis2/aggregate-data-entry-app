import { useContext } from 'react'
import { NoFormOrLockedContext } from './no-form-or-locked-info-context.js'

export function useNoFormOrLockedContext() {
    return useContext(NoFormOrLockedContext)
}
