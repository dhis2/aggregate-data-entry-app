import { useEffect } from 'react'
import { useRightHandPanelContext } from '../right-hand-panel/index.js'
import {
    useAttributeOptionComboSelection,
    useDataSetId,
    useOrgUnitId,
    usePeriodId,
} from '../shared/index.js'

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
