import { useCallback } from 'react'
import { useIsMutating, useQueries } from 'react-query'
import {
    useDataSetId,
    useOrgUnitId,
    usePeriodId,
} from '../../context-selection/index.js'
import { useApiAttributeParams } from '../../shared/index.js'

const getValidationMetaDataQueryKey = (datasetId) => {
    const queryKey = [
        `validationRules`,
        {
            params: {
                dataSet: datasetId,
                fields: [
                    'id',
                    'importance',
                    'operator',
                    'leftSide',
                    'rightSide',
                    'displayInstruction',
                    'displayDescription',
                    'displayName',
                ],
            },
        },
    ]

    return queryKey
}

const getValidationQueryKey = (
    datasetId,
    { periodId, orgUnitId, categoryComboId, categoryOptionIds }
) => {
    const params = {
        pe: periodId,
        ou: orgUnitId,
        cc: categoryComboId,
        cp: categoryOptionIds?.join(';'),
    }

    const validationQueryKey = [
        `validation/dataSet/${datasetId}`,
        {
            params,
        },
    ]
    return validationQueryKey
}

/** Returns validation rule violations grouped by importance */
export const useValidationResult = () => {
    const [datasetId] = useDataSetId()

    const [periodId] = usePeriodId()
    const [orgUnitId] = useOrgUnitId()
    const {
        attributeCombo: categoryComboId,
        attributeOptions: categoryOptionIds,
    } = useApiAttributeParams()

    const validationQueryKey = getValidationQueryKey(datasetId, {
        periodId,
        orgUnitId,
        categoryComboId,
        categoryOptionIds,
    })
    const validationMetaDataQueryKey = getValidationMetaDataQueryKey(datasetId)

    const activeMutations = useIsMutating({ mutationKey: validationQueryKey })
    const enabled = activeMutations === 0

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

    return {
        refetch,
        error: validationQuery.error || metaDataQuery.error,
        isLoading: validationQuery.isLoading || metaDataQuery.isLoading,
        isRefetching:
            validationQuery.isRefetching || metaDataQuery.isRefetching,
        data:
            validationQuery.isSuccess && metaDataQuery.isSuccess
                ? groupValidationRuleViolationsByImportance(
                      validationQuery.data,
                      metaDataQuery.data
                  )
                : undefined,
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
