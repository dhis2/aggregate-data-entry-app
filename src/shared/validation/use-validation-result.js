import { useQueries } from '@tanstack/react-query'
import { useCallback, useEffect } from 'react'
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
export default function useValidationResult({ enabled = true, onError, onSuccess } = {}) {
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
            { queryKey: validationQueryKey, enabled },
            { queryKey: validationMetaDataQueryKey, enabled },
        ],
    })

    const refetch = useCallback(() => {
        results.forEach((result) => result.refetch())
    }, [results])

    const [validationQuery, metaDataQuery] = results

    const error = validationQuery.error || metaDataQuery.error
    const isLoading = validationQuery.isLoading || metaDataQuery.isLoading
    const isRefetching =
        validationQuery.isRefetching || metaDataQuery.isRefetching
    const data =
        validationQuery.data && metaDataQuery.data
            ? buildValidationResult(
                  validationQuery.data,
                  metaDataQuery.data
              )
            : undefined

    useEffect(() => {
        if (error && enabled && onError) {
            onError(error)
        }
    }, [error, enabled, onError])

    useEffect(() => {
        if (!error && !isLoading && !isRefetching && enabled && onSuccess) {
            onSuccess(data)
        }
    }, [error, isLoading, isRefetching, data, enabled, onSuccess])

    return { refetch, error, isLoading, isRefetching, data }
}
