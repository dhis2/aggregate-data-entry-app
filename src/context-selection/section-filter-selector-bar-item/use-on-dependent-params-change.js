import { useEffect, useRef } from 'react'
import {
    useAttributeOptionComboSelection,
    useDataSetId,
    useOrgUnitId,
    usePeriodId,
} from '../../shared/index.js'

export default function useOnDependentParamsChange(cb) {
    const initialExecution = useRef(true)
    const [dataSetId] = useDataSetId()
    const [periodId] = usePeriodId()
    const [orgUnitId] = useOrgUnitId()
    const [attributeOptionComboSelection] = useAttributeOptionComboSelection()

    useEffect(() => {
        if (initialExecution.current) {
            initialExecution.current = false
        } else {
            cb()
        }
    }, [cb, dataSetId, orgUnitId, periodId, attributeOptionComboSelection])
}
