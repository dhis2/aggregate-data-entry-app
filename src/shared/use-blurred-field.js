import { useState, useEffect, useRef } from 'react'
import { useFormState } from 'react-final-form'

export const useBlurredField = () => {
    const previouslyActiveFieldRef = useRef(null)
    const [blurredField, setBlurredField] = useState(null)
    const { active } = useFormState({ subscription: { active: true } })

    useEffect(() => {
        if (active) {
            const newBlurredField = previouslyActiveFieldRef.current
            previouslyActiveFieldRef.current = active
            setBlurredField(newBlurredField)
        }
    }, [active])

    return blurredField
}
