import { useEffect, useRef } from 'react'
import {
    useCategoryOptionComboSelection,
    useDataSetId,
    useOrgUnitId,
    usePeriodId,
} from '../use-context-selection.js'

export default function useOnDependentParamsChange(cb) {
    const initialExecution = useRef(true)
    const [dataSetId] = useDataSetId()
    const [periodId] = usePeriodId()
    const [orgUnitId] = useOrgUnitId()
    const [categoryOptionComboSelection] = useCategoryOptionComboSelection()

    useEffect(() => {
        if (initialExecution.current) {
            initialExecution.current = false
        } else {
            cb()
        }
    }, [dataSetId, orgUnitId, periodId, categoryOptionComboSelection])
}
