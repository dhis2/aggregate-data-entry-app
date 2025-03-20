import React from 'react'
import { ValidationRuleViolationWithMetaDataPropTypes } from './validation-result-prop-types.js'
import ValidationRuleExpressionWithStaticDescription from './validation-rule-expression-with-description.jsx'
import ValidationRuleExpressionWithValues from './validation-rule-expression-with-values.jsx'

/**
 * operators that have a description, not a formula with a right and left side values
 */
const descriptionOnlyOperators = ['compulsory_pair', 'exclusive_pair']

const ValidationRuleExpression = ({ validationRule }) => {
    const { metaData: { operator } = {} } = validationRule

    if (descriptionOnlyOperators.includes(operator)) {
        return (
            <ValidationRuleExpressionWithStaticDescription
                validationRule={validationRule}
            />
        )
    }

    return (
        <ValidationRuleExpressionWithValues validationRule={validationRule} />
    )
}

ValidationRuleExpression.propTypes = {
    validationRule: ValidationRuleViolationWithMetaDataPropTypes,
}
export default ValidationRuleExpression
