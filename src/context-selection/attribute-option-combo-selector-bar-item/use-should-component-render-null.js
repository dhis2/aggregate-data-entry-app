import { useDataSetId, useOrgUnitId, usePeriodId } from '../../shared/index.js'

export default function useShouldComponentRenderNull(categoryCombination) {
    const [dataSetId] = useDataSetId()
    const [periodId] = usePeriodId()
    const [orgUnitId] = useOrgUnitId()

    return (
        categoryCombination?.isDefault ||
        !dataSetId ||
        !periodId ||
        !orgUnitId ||
        !categoryCombination.categories.length
    )
}
