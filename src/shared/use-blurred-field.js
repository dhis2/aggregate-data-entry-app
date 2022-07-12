import { useMemo, useRef } from 'react'
import { useFormState } from 'react-final-form'

export const useBlurredField = () => {
    const previouslyActiveFieldRef = useRef(undefined)
    const { active } = useFormState({ subscription: { active: true } })

    return useMemo(() => {
        const blurredField = previouslyActiveFieldRef.current
        previouslyActiveFieldRef.current = active
        return blurredField
    }, [active])
}
