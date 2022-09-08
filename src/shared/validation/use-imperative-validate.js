import { useQueryClient } from '@tanstack/react-query'
import {
    useApiAttributeParams,
    useDataSetId,
    useOrgUnitId,
    usePeriodId,
} from '../../shared/index.js'
import buildValidationResult from './build-validation-result.js'
import {
    getValidationMetaDataQueryKey,
    getValidationQueryKey,
} from './query-key-factory.js'

/**
 * Returns validation rule violations grouped by importance
 * @params {Object} options
 * @params {Boolean} options.enabled - Defaults to `true`
 **/
export default function useImperativeValidate() {
    const client = useQueryClient()
    const [dataSetId] = useDataSetId()
    const [periodId] = usePeriodId()
    const [orgUnitId] = useOrgUnitId()
    const {
        attributeCombo: categoryComboId,
        attributeOptions: categoryOptionIds,
    } = useApiAttributeParams()

    return () => {
        const validationQueryKey = getValidationQueryKey({
            dataSetId,
            periodId,
            orgUnitId,
            categoryComboId,
            categoryOptionIds,
        })
        const validationMetaDataQueryKey = getValidationMetaDataQueryKey(dataSetId)

        const vQ = client.fetchQuery(validationQueryKey)
        const vMDQ = client.fetchQuery(validationMetaDataQueryKey)

        return Promise.all([vQ, vMDQ]).then(([validationResponse, metadataResponse]) => {
            return buildValidationResult(
              validationResponse,
              metadataResponse
          )
        })
    }
}
