import { useEffect } from 'react'
import {
    useAttributeOptionComboSelection,
    useDataSetId,
    useOrgUnitId,
    usePeriodId,
} from '../shared/index.js'
import useRightHandPanelContext from './use-right-hand-panel-context.js'

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
