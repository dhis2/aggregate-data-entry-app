import { useRef } from 'react'
import { useHighlightedFieldStore } from './stores/highlighted-field-store.js'

export const useBlurredField = () => {
    const previouslyActiveFieldRef = useRef(undefined)

    const { dataElementId, categoryOptionComboId } =
        useHighlightedFieldStore((state) => state.getHighlightedField()) || {}
    const fieldId = `${dataElementId}.${categoryOptionComboId}`

    const blurredField = previouslyActiveFieldRef.current
    previouslyActiveFieldRef.current = fieldId
    return blurredField
}
