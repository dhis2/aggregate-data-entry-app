import { useEffect } from 'react'
import {
    useAttributeOptionComboSelection,
    useDataSetId,
    useOrgUnitId,
    usePeriodId,
} from '../context-selection/index.js'
import { useRightHandPanelContext } from '../right-hand-panel/index.js'

export default function useCloseRightHandPanelOnSelectionChange() {
    const { hide } = useRightHandPanelContext()
    const [dataSetId] = useDataSetId()
    const [periodId] = usePeriodId()
    const [orgUnitId] = useOrgUnitId()
    const [attributeOptionComboSelection] = useAttributeOptionComboSelection()

    useEffect(() => {
        hide()
    }, [dataSetId, periodId, orgUnitId, attributeOptionComboSelection, hide])
}
