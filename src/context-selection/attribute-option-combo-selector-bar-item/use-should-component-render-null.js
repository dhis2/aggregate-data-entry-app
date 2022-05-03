import {
    useDataSetId,
    useOrgUnitId,
    usePeriodId,
} from '../use-context-selection/index.js'

/*
 * `categoryCombination.loading` does not mean that "null" should be rendered.
 * This happens automatically during the first loading as
 * `!categoryCombination.data?.categories.length` resolves to `true`.
 *
 * But when data is stale and this function has determined that the component
 * should not render `null`, then it's most likely not going to change when
 * reloading
 */
export default function useShouldComponentRenderNull(categoryCombination) {
    const [dataSetId] = useDataSetId()
    const [periodId] = usePeriodId()
    const [orgUnitId] = useOrgUnitId()

    return (
        !dataSetId ||
        !periodId ||
        !orgUnitId ||
        // if it is the default combo,
        // then it doesn't matter if there are categories or not
        (!categoryCombination.isDefault &&
            !categoryCombination.categories.length)
    )
}
