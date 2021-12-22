import { useEffect, useRef } from 'react'
import {
    useDataSetId,
    useOrgUnitId,
    usePeriodId,
} from '../use-context-selection.js'

export default function useOnDependentParamsChange(cb) {
    const initialExecution = useRef(true)
    const [dataSetId] = useDataSetId()
    const [periodId] = usePeriodId()
    const [orgUnitId] = useOrgUnitId()

    useEffect(() => {
        if (initialExecution) {
            initialExecution.current = false
        } else {
            cb()
        }
    }, [dataSetId, orgUnitId, periodId])
}
