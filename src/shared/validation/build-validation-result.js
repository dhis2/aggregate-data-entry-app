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

export default function buildValidationResult(
    validationRuleViolations = {},
    validationRulesMetaData = {}
) {
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
