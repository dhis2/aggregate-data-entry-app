import {
    selectors,
    useMetadata,
    useDataSetId,
    useOrgUnitId,
    usePeriodId,
} from '../../shared/index.js'

export default function useShouldComponentRenderNull() {
    const [dataSetId] = useDataSetId()
    const [orgUnitId] = useOrgUnitId()
    const [periodId] = usePeriodId()
    const { data: metadata } = useMetadata()
    const dataSet = selectors.getDataSetById(metadata, dataSetId)

    return (
        !dataSet ||
        !orgUnitId ||
        !periodId ||
        'SECTION' !== dataSet.formType ||
        dataSet.sections.length === 0
    )
}
