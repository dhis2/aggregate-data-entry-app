import { useEffect, useState } from 'react'
import { useCategoryOptionComboSelection } from '../use-context-selection.js'

export default function useDeselectOnCocChange(deselectAll) {
    const [initialExecution, setInitialExecution] = useState(true)
    const [categoryOptionComboSelection] = useCategoryOptionComboSelection()

    useEffect(() => {
        if (!initialExecution) {
            setInitialExecution(false)
        } else {
            deselectAll()
        }
    }, [initialExecution, setInitialExecution, categoryOptionComboSelection])
}
