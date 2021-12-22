import {
    useDataSetId,
    useOrgUnitId,
    usePeriodId,
} from '../use-context-selection.js'
import useCategoryCombination from './use-category-combination.js'

export default function useShouldComponentRenderNull() {
    const [dataSetId] = useDataSetId()
    const [periodId] = usePeriodId()
    const [orgUnitId] = useOrgUnitId()
    const categoryCombination = useCategoryCombination()

    return (
        !dataSetId ||
        !periodId ||
        !orgUnitId ||
        categoryCombination.loading ||
        !categoryCombination.data?.categories.length ||
        categoryCombination.data?.isDefault
    )
}
