import { useEffect, useRef } from 'react'
import { useFormState } from 'react-final-form'
import { useRightHandPanelContext } from '../right-hand-panel/index.js'

export default function useCloseSidebarOnFieldChange() {
    const rightHandPanel = useRightHandPanelContext()
    const subscribe = { active: true }
    const formState = useFormState({ subscribe })
    const prevActiveFieldRef = useRef(formState.active)

    useEffect(() => {
        const prevActiveField = prevActiveFieldRef.current
        const activeField = formState.active

        if (
            // Then panel is open
            // This also ensures that there was a previously focused field
            rightHandPanel.id &&
            // The user didn't focus another input
            !!activeField &&
            // The previously focused item and the currently focused item are
            // not the same
            prevActiveField !== activeField
        ) {
            rightHandPanel.hide()
        }

        if (prevActiveFieldRef.current !== activeField) {
            prevActiveFieldRef.current = activeField
        }
    }, [prevActiveFieldRef, formState.active, rightHandPanel])
}
