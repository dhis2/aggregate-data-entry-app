import { useDataSetId, useOrgUnitId, usePeriodId } from '../../shared/index.js'

export default function useShouldComponentRenderNull(
    categoryCombination,
    categoryWithNoOptionsExists
) {
    const [dataSetId] = useDataSetId()
    const [periodId] = usePeriodId()
    const [orgUnitId] = useOrgUnitId()

    return (
        categoryCombination?.isDefault ||
        !dataSetId ||
        !periodId ||
        !orgUnitId ||
        categoryWithNoOptionsExists ||
        // if it is the default combo, it'll already render null, see above
        !categoryCombination.categories.length
    )
}
