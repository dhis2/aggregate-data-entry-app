import { useEffect, useState } from 'react'
import { useOrgUnitId } from '../use-context-selection.js'

export default function useDeselectOnOrgUnitChange(deselectAll) {
    const [initialExecution, setInitialExecution] = useState(true)
    const [orgUnitId] = useOrgUnitId()

    useEffect(() => {
        if (!initialExecution) {
            setInitialExecution(false)
        } else {
            deselectAll()
        }
    }, [initialExecution, setInitialExecution, orgUnitId])
}
