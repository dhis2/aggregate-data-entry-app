import { useApiAttributeParams } from '../use-api-attribute-params.js'
import { useContextSelection } from '../use-context-selection/index.js'
import { dataValueSets } from './query-key-factory.js'

export default function useDataValueSetQueryKey() {
    const [{ dataSetId, orgUnitId, periodId }] = useContextSelection()
    const {
        attributeCombo: categoryComboId,
        // Note these are sorted:
        attributeOptions: categoryOptionIds,
    } = useApiAttributeParams() || {}

    return dataValueSets.byIds({
        dataSetId,
        periodId,
        orgUnitId,
        categoryComboId,
        categoryOptionIds,
    })
}
