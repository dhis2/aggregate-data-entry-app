import { useState } from 'react'
import { useCategoryOptionComboSelection } from '../use-context-selection.js'

export default function useSelected() {
    const [categoryOptionComboSelection] = useCategoryOptionComboSelection()
    return useState(() => {
        return categoryOptionComboSelection.reduce((acc, cur) => {
            const [key, value] = cur.split(':')
            return { ...acc, [key]: value }
        }, {})
    })
}
