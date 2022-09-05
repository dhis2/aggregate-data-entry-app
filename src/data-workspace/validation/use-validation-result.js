import { useQueries } from '@tanstack/react-query'
import { useCallback } from 'react'
import {
    useApiAttributeParams,
    useDataSetId,
    useOrgUnitId,
    usePeriodId,
} from '../../shared/index.js'
import {
    getValidationMetaDataQueryKey,
    getValidationQueryKey,
} from '../query-key-factory.js'

/** Returns validation rule violations grouped by importance */
export const useValidationResult = () => {
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

const buildValidationResult = (
    validationRuleViolations = {},
    validationRulesMetaData = {}
) => {
    const { commentRequiredViolations } = validationRuleViolations
    const validationRulesGroupedByImportance =
        groupValidationRuleViolationsByImportance(
            validationRuleViolations,
            validationRulesMetaData
        )

    return {
        validationRuleViolations: validationRulesGroupedByImportance,
        commentRequiredViolations,
    }
}

const groupValidationRuleViolationsByImportance = (
    validationRuleViolations = {},
    validationRulesMetaData = {}
) => {
    const ruleViolationsWithMetadata =
        validationRuleViolations.validationRuleViolations?.map((violation) => ({
            ...violation,
            metaData: validationRulesMetaData.validationRules?.find(
                (metadataRule) =>
                    metadataRule.id === violation.validationRule.id
            ),
        }))

    return ruleViolationsWithMetadata?.reduce((grouped, item) => {
        const identifier = item.metaData.importance

        grouped[identifier] = grouped[identifier] ?? []
        grouped[identifier].push(item)

        return grouped
    }, {})
}
