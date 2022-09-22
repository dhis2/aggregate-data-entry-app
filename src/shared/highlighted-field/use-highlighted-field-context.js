import { useContext } from 'react'
import {
    HighlightedFieldIdContext,
    SetHighlightedFieldIdContext,
} from './highlighted-field-context.js'

export function useHighlightedFieldIdContext() {
    return useContext(HighlightedFieldIdContext)
}

export function useSetHighlightedFieldIdContext() {
    return useContext(SetHighlightedFieldIdContext)
}
