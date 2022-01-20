import { useForm } from 'react-final-form'

/**
 * Tried using `form.focus(fieldName)` and
 * `currentInput.dispatchEvent(<tab event>)` but neither worked.
 * Open to better solutions than doc.querySelector
 *
 * @param {string} fieldName
 * @returns {Object} { focusNext: function, focusPrev: function }
 */
export const useFieldNavigation = (fieldName) => {
    const form = useForm()

    // Returns an array of field names (strings)
    const fields = form.getRegisteredFields()

    const focusNext = () => {
        const currentIdx = fields.indexOf(fieldName)
        const nextIdx = (currentIdx + 1) % fields.length
        const nextName = fields[nextIdx]
        const nextInput = document.querySelector(`input[name="${nextName}"]`)
        nextInput.focus()
        nextInput.select() // the normal behavior when using 'tab'
    }
    const focusPrev = () => {
        const currentIdx = fields.indexOf(fieldName)
        // %-operator doesn't work as desired with negatives in JS, so simple condition check instead:
        const prevIdx = currentIdx === 0 ? fields.length - 1 : currentIdx - 1
        const prevName = fields[prevIdx]
        const prevInput = document.querySelector(`input[name="${prevName}"]`)
        prevInput.focus()
        prevInput.select()
    }

    return { focusNext, focusPrev }
}
