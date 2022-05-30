import { tabbable } from 'tabbable'

// Need to get tabbable list every time in case form changes
export default function focusNext() {
    const rootNode = document.getElementById('data-workspace')
    const tabbableElements = tabbable(rootNode)
    const currentIndex = tabbableElements.indexOf(document.activeElement)
    // %-operator doesn't work as desired with negatives in JS,
    // so simple condition check instead:
    const prevIndex =
        currentIndex === 0 ? tabbableElements.length - 1 : currentIndex - 1
    const prevElement = tabbableElements[prevIndex]
    prevElement.focus()
    prevElement.select?.()
}
