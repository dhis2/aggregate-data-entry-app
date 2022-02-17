import PropTypes from 'prop-types'
import React from 'react'
import { tabbable } from 'tabbable'

// todo: should we skip filter fields and focus only inputs?
// todo: does not work with `select` components (because focus gets trapped in portal?)

/**
 * Emulates 'tab' behavior to focus next/previous fields in the workspace
 * with other keybinds
 */
export const KeyboardNavManager = ({ children }) => {
    const rootNodeRef = React.useRef()

    const focusNext = () => {
        // Need to get this list every time in case form changes
        const tabbableElements = tabbable(rootNodeRef.current)
        const currentIdx = tabbableElements.indexOf(document.activeElement)
        const nextIdx = (currentIdx + 1) % tabbableElements.length
        const nextElement = tabbableElements[nextIdx]
        nextElement.focus()
        nextElement.select?.() // Select text, if possible
    }
    const focusPrev = () => {
        const tabbableElements = tabbable(rootNodeRef.current)
        const currentIdx = tabbableElements.indexOf(document.activeElement)
        // %-operator doesn't work as desired with negatives in JS, so simple condition check instead:
        const prevIdx =
            currentIdx === 0 ? tabbableElements.length - 1 : currentIdx - 1
        const prevElement = tabbableElements[prevIdx]
        prevElement.focus()
        prevElement.select?.()
    }

    const handleKeyDown = (event) => {
        const { key } = event
        if (key === 'ArrowDown' || key === 'Enter') {
            event.preventDefault()
            focusNext()
        } else if (key === 'ArrowUp') {
            event.preventDefault()
            focusPrev()
        }
        // tab and shift-tab on their own work as expected
    }

    return (
        <div ref={rootNodeRef} onKeyDown={handleKeyDown}>
            {children}
        </div>
    )
}
KeyboardNavManager.propTypes = {
    children: PropTypes.node,
}
