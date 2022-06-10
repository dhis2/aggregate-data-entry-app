import { useCallback } from 'react'
import { useAttributeOptionComboSelection } from '../use-context-selection/index.js'
import omit from './omit.js'

export default function useSelected() {
    const [attributeOptionComboSelection, setAttributeOptionComboSelection] =
        useAttributeOptionComboSelection()

    const select = useCallback(
        ({ value, categoryId }) => {
            const nextSelected = !value
                ? omit(categoryId, attributeOptionComboSelection)
                : { ...attributeOptionComboSelection, [categoryId]: value }

            if (!Object.values(nextSelected).length) {
                setAttributeOptionComboSelection(undefined)
            } else {
                setAttributeOptionComboSelection(nextSelected)
            }
        },
        [attributeOptionComboSelection, setAttributeOptionComboSelection]
    )

    return {
        select,
        selected: attributeOptionComboSelection,
    }
}
