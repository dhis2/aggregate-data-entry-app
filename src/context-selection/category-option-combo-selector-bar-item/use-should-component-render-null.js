import {
    useDataSetId,
    useOrgUnitId,
    usePeriodId,
} from '../use-context-selection.js'
import useCategoryCombination from './use-category-combination.js'

/*
 * `categoryCombination.loading` does not mean that "null" should be rendered.
 * This happens automatically during the first loading as
 * `!categoryCombination.data?.categories.length` resolves to `true`.
 *
 * But when data is stale and this function has determined that the component
 * should not render `null`, then it's most likely not going to change when
 * reloading
 */
export default function useShouldComponentRenderNull() {
    const [dataSetId] = useDataSetId()
    const [periodId] = usePeriodId()
    const [orgUnitId] = useOrgUnitId()
    const categoryCombination = useCategoryCombination()

    return (
        !dataSetId ||
        !periodId ||
        !orgUnitId ||
        !categoryCombination.called ||
        !categoryCombination.data?.categories.length ||
        categoryCombination.data?.isDefault
    )
}
