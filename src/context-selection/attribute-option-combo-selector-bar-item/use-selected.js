import { useEffect, useCallback } from 'react'
import {
    selectors,
    useAttributeOptionComboSelection,
    useMetadata,
} from '../../shared/index.js'
import omit from './omit.js'

export default function useSelected() {
    const [attributeOptionComboSelection, setAttributeOptionComboSelection] =
        useAttributeOptionComboSelection()
    const { data: metadata } = useMetadata()

    useEffect(() => {
        for (const categoryId of Object.keys(attributeOptionComboSelection)) {
            if (!selectors.getCategoryById(metadata, categoryId)) {
                setAttributeOptionComboSelection(undefined)
                return
            }
        }
        for (const categoryOptionid of Object.values(
            attributeOptionComboSelection
        )) {
            if (!selectors.getCategoryOptionById(metadata, categoryOptionid)) {
                setAttributeOptionComboSelection(undefined)
                return
            }
        }
    }, [
        attributeOptionComboSelection,
        metadata,
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
        selected: attributeOptionComboSelection,
    }
}
