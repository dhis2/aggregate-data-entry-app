import { useEffect, useState } from 'react'
import { useDataSetId } from '../use-context-selection.js'

export default function useDeselectOnDataSetChange(deselectAll) {
    const [initialExecution, setInitialExecution] = useState(true)
    const [dataSetId] = useDataSetId()

    useEffect(() => {
        if (!initialExecution) {
            setInitialExecution(false)
        } else {
            deselectAll()
        }
    }, [initialExecution, setInitialExecution, dataSetId])
}
