import PropTypes from 'prop-types'
import React from 'react'
import { tabbable } from 'tabbable'
import { useSidebar } from '../sidebar/index.js'

// todo: does not work with `select` components (because focus gets trapped in portal?)

const focusNext = (rootNode) => {
    // Need to get this list every time in case form changes
    const tabbableElements = tabbable(rootNode)
    const currentIdx = tabbableElements.indexOf(document.activeElement)
    const nextIdx = (currentIdx + 1) % tabbableElements.length
    const nextElement = tabbableElements[nextIdx]
    nextElement.focus()
    nextElement.select?.() // Select text, if possible
}
const focusPrev = (rootNode) => {
    const tabbableElements = tabbable(rootNode)
    const currentIdx = tabbableElements.indexOf(document.activeElement)
    // %-operator doesn't work as desired with negatives in JS, so simple condition check instead:
    const prevIdx =
        currentIdx === 0 ? tabbableElements.length - 1 : currentIdx - 1
    const prevElement = tabbableElements[prevIdx]
    prevElement.focus()
    prevElement.select?.()
}

/**
 * Emulates 'tab' behavior to focus next/previous fields in the workspace
 * with other keybinds
 * tab and shift-tab on their own work as expected
 */
export const KeyboardNavManager = ({ children }) => {
    const rootNodeRef = React.useRef()
    const { showDataDetails } = useSidebar()

    const handleKeyDown = (event) => {
        const { key, shiftKey } = event

        if (shiftKey && key === 'Enter') {
            showDataDetails()
        } else if (key === 'ArrowDown' || key === 'Enter') {
            event.preventDefault()
            focusNext(rootNodeRef.current)
        } else if (key === 'ArrowUp') {
            event.preventDefault()
            focusPrev(rootNodeRef.current)
        }
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
