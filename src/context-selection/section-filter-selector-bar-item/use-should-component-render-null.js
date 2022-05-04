import { selectors, useMetadata } from '../../metadata/index.js'
import { useDataSetId } from '../use-context-selection/index.js'

/*
 * `dataSetSectionsInfo.loading` does not mean that "null" should be rendered.
 * This happens automatically during the first loading as
 * `'SECTION' !== dataSetSectionsInfo.data?.formType` resolves to `true`.
 *
 * But when data is stale and this function has determined that the component
 * should not render `null`, then it's most likely not going to change when
 * reloading
 */
export default function useShouldComponentRenderNull() {
    const [dataSetId] = useDataSetId()
    const { data: metadata } = useMetadata()
    const dataSet = selectors.getDataSets(metadata)[dataSetId]

    return (
        !dataSet ||
        'SECTION' !== dataSet.formType ||
        dataSet.sections.length === 0
    )
}
