import { selectors, useMetadata } from '../../metadata/index.js'
import { useDataSetId, useOrgUnitId, usePeriodId } from '../use-context-selection/index.js'

export default function useShouldComponentRenderNull() {
    const [dataSetId] = useDataSetId()
    const [orgUnitId] = useOrgUnitId()
    const [periodId] = usePeriodId()
    const { data: metadata } = useMetadata()
    const dataSet = selectors.getDataSets(metadata)[dataSetId]

    return (
        !dataSet ||
        !orgUnitId ||
        !periodId ||
        'SECTION' !== dataSet.formType ||
        dataSet.sections.length === 0
    )
}
