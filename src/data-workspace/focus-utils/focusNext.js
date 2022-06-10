import { tabbable } from 'tabbable'

// Need to get tabbable list every time in case form changes
export default function focusNext() {
    const rootNode = document.getElementById('data-workspace')
    const tabbableElements = tabbable(rootNode)
    const currentIndex = tabbableElements.indexOf(document.activeElement)
    const nextIndex = (currentIndex + 1) % tabbableElements.length
    const nextElement = tabbableElements[nextIndex]
    nextElement.focus()
    nextElement.select?.() // Select text, if possible
}
