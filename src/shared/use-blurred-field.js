import { useRef } from 'react'
import { getFieldId } from '../data-workspace/get-field-id.jsx'
import { useHighlightedFieldStore } from './stores/highlighted-field-store.js'

export const useBlurredField = () => {
    const previouslyActiveFieldRef = useRef(undefined)

    const { dataElementId, categoryOptionComboId } =
        useHighlightedFieldStore((state) => state.getHighlightedField()) || {}
    const fieldId = getFieldId(dataElementId, categoryOptionComboId)

    const blurredField = previouslyActiveFieldRef.current
    previouslyActiveFieldRef.current = fieldId
    return blurredField
}
