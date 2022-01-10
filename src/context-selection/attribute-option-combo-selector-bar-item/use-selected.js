import { useEffect, useState } from 'react'
import { useAttributeOptionComboSelection } from '../use-context-selection/index.js'
import omit from './omit.js'

const createStateFromUrlParam = (urlParams) => {
    return urlParams.reduce((acc, cur) => {
        const [key, value] = cur.split(':')
        return { ...acc, [key]: value }
    }, {})
}

export default function useSelected() {
    const [attributeOptionComboSelection, setAttributeOptionComboSelection] =
        useAttributeOptionComboSelection()

    const [selected, setSelected] = useState(() =>
        createStateFromUrlParam(attributeOptionComboSelection)
    )

    useEffect(() => {
        setSelected(createStateFromUrlParam(attributeOptionComboSelection))
    }, [attributeOptionComboSelection])

    const deselectAll = () => {
        setSelected({})
        setAttributeOptionComboSelection([])
    }

    const select = ({ value, categoryId }) => {
        const nextSelected = !value
            ? omit(categoryId, selected)
            : { ...selected, [categoryId]: value }

        const nextAttributeOptionComboSelection = Object.entries(
            nextSelected
        ).map(([key, value]) => `${key}:${value}`)

        setSelected(nextSelected)
        setAttributeOptionComboSelection(nextAttributeOptionComboSelection)
    }

    return {
        select,
        selected,
        deselectAll,
    }
}
