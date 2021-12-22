import { useEffect, useState } from 'react'
import { useCategoryOptionComboSelection } from '../use-context-selection.js'
import omit from './omit.js'

const createStateFromUrlParam = urlParams => {
    return urlParams.reduce((acc, cur) => {
        const [key, value] = cur.split(':')
        return { ...acc, [key]: value }
    }, {})
}

export default function useSelected() {
    const [
        categoryOptionComboSelection,
        setCategoryOptionComboSelection,
    ] = useCategoryOptionComboSelection()

    const [selected, setSelected] = useState(() =>
        createStateFromUrlParam(categoryOptionComboSelection)
    )

    useEffect(() => {
        setSelected(createStateFromUrlParam(categoryOptionComboSelection))
    }, [categoryOptionComboSelection])

    const deselectAll = () => {
        setSelected({})
        setCategoryOptionComboSelection([])
    }

    const select = ({ value, categoryId }) => {
        const nextSelected = !value
            ? omit(categoryId, selected)
            : { ...selected, [categoryId]: value }

        const nextCategoryOptionComboSelection = Object.entries(
            nextSelected
        ).map(([key, value]) => `${key}:${value}`)

        setSelected(nextSelected)
        setCategoryOptionComboSelection(nextCategoryOptionComboSelection)
    }

    return {
        select,
        selected,
        deselectAll,
    }
}
