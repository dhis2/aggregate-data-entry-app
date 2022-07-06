import { useContext } from 'react'
import {
    CurrentItemContext,
    SetCurrentItemContext,
} from './current-item-context.js'

export function useCurrentItemContext() {
    return useContext(CurrentItemContext)
}

export function useSetCurrentItemContext() {
    return useContext(SetCurrentItemContext)
}
