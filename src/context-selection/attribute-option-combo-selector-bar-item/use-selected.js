import { useCallback } from 'react'
import { useAttributeOptionComboSelection } from '../use-context-selection/index.js'
import omit from './omit.js'

export default function useSelected(relevantCategoriesWithOptions) {
    const [attributeOptionComboSelection, setAttributeOptionComboSelection] =
        useAttributeOptionComboSelection()

    const deselectAll = useCallback(() => {
        const nextAocSelection = Object.fromEntries(
            Object.entries(attributeOptionComboSelection).filter(
                ([categoryId, optionId]) => {
                    return relevantCategoriesWithOptions.find(
                        (category) =>
                            category.id === categoryId &&
                            category.categoryOptions.find(
                                (categoryOption) =>
                                    categoryOption.id === optionId
                            )
                    )
                }
            )
        )

        if (
            JSON.stringify(nextAocSelection) ===
            JSON.stringify(attributeOptionComboSelection)
        ) {
            return
        }

        return setAttributeOptionComboSelection(nextAocSelection)
    }, [
        relevantCategoriesWithOptions,
        attributeOptionComboSelection,
        setAttributeOptionComboSelection,
    ])

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
        deselectAll,
        selected: attributeOptionComboSelection,
    }
}
