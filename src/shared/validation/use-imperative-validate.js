import { useQueryClient } from '@tanstack/react-query'
import { useApiAttributeParams } from '../use-api-attribute-params.js'
import { useContextSelection } from '../use-context-selection/index.js'
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
export const useImperativeValidate = () => {
    const client = useQueryClient()
    const [{ dataSetId, orgUnitId, periodId }] = useContextSelection()
    const {
        attributeCombo: categoryComboId,
        // Note these are sorted:
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
        const validationMetaDataQueryKey =
            getValidationMetaDataQueryKey(dataSetId)

        const vQ = client.fetchQuery(validationQueryKey)
        const vMDQ = client.fetchQuery(validationMetaDataQueryKey)

        return Promise.all([vQ, vMDQ]).then(
            ([validationResponse, metadataResponse]) => {
                return buildValidationResult(
                    validationResponse,
                    metadataResponse
                )
            }
        )
    }
}
