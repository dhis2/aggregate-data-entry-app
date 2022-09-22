import { useQueries } from '@tanstack/react-query'
import { useCallback } from 'react'
import { useApiAttributeParams } from '../use-api-attribute-params.js'
import {
    useDataSetId,
    useOrgUnitId,
    usePeriodId,
} from '../use-context-selection/index.js'
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
export default function useValidationResult() {
    const [dataSetId] = useDataSetId()
    const [periodId] = usePeriodId()
    const [orgUnitId] = useOrgUnitId()
    const {
        attributeCombo: categoryComboId,
        attributeOptions: categoryOptionIds,
    } = useApiAttributeParams()

    const validationQueryKey = getValidationQueryKey({
        dataSetId,
        periodId,
        orgUnitId,
        categoryComboId,
        categoryOptionIds,
    })
    const validationMetaDataQueryKey = getValidationMetaDataQueryKey(dataSetId)

    const results = useQueries({
        queries: [
            { queryKey: validationQueryKey },
            { queryKey: validationMetaDataQueryKey },
        ],
    })

    const refetch = useCallback(() => {
        results.forEach((result) => result.refetch())
    }, [results])

    const [validationQuery, metaDataQuery] = results

    return {
        refetch,
        error: validationQuery.error || metaDataQuery.error,
        isLoading: validationQuery.isLoading || metaDataQuery.isLoading,
        isRefetching:
            validationQuery.isRefetching || metaDataQuery.isRefetching,
        data:
            validationQuery.data && metaDataQuery.data
                ? buildValidationResult(
                      validationQuery.data,
                      metaDataQuery.data
                  )
                : undefined,
    }
}
