import { useEffect, useState } from 'react'
import { usePeriodId } from '../use-context-selection.js'

export default function useDeselectOnPeriodChange(deselectAll) {
    const [initialExecution, setInitialExecution] = useState(true)
    const [periodId] = usePeriodId()

    useEffect(() => {
        if (!initialExecution) {
            setInitialExecution(false)
        } else {
            deselectAll()
        }
    }, [initialExecution, setInitialExecution, periodId])
}
