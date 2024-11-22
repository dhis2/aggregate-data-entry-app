import { useRef } from 'react'
import { useHighlightedField } from './highlighted-field/index.js'

export const useBlurredField = () => {
    const previouslyActiveFieldRef = useRef(undefined)
    const { dataElement, categoryOptionCombo } = useHighlightedField() || {}
    const fieldId = `${dataElement}.${categoryOptionCombo}`

    const blurredField = previouslyActiveFieldRef.current
    previouslyActiveFieldRef.current = fieldId
    return blurredField
}
