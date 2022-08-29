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
        // if it is the default combo, it'll already render null, see above
        !categoryCombination.categories.length
    )
}
