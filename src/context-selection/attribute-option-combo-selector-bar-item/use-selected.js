import { useAttributeOptionComboSelection } from '../use-context-selection/index.js'
import omit from './omit.js'

export default function useSelected() {
    const [attributeOptionComboSelection, setAttributeOptionComboSelection] =
        useAttributeOptionComboSelection()

    const deselectAll = () => setAttributeOptionComboSelection(undefined)

    const select = ({ value, categoryId }) => {
        const nextSelected = !value
            ? omit(categoryId, attributeOptionComboSelection)
            : { ...attributeOptionComboSelection, [categoryId]: value }

        if (!Object.values(nextSelected).length) {
            setAttributeOptionComboSelection(undefined)
        } else {
            setAttributeOptionComboSelection(nextSelected)
        }

    }

    return {
        select,
        deselectAll,
        selected: attributeOptionComboSelection,
    }
}
