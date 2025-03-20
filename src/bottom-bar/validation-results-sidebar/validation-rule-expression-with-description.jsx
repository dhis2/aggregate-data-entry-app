import i18n from '@dhis2/d2-i18n'
import React from 'react'
import { ValidationRuleViolationWithMetaDataPropTypes } from './validation-result-prop-types.js'
import styles from './validation-rule-expression.module.css'

const buildExpressionDescription = ({
    operator,
    leftDescription,
    rightDescription,
}) => {
    const formulas = {
        compulsory_pair: i18n.t(
            '{{leftDescription}} cannot be empty when {{rightDescription}} has a value',
            { leftDescription, rightDescription }
        ),
        exclusive_pair: i18n.t(
            '{{leftDescription}} cannot have a value when {{rightDescription}} has a value',
            { leftDescription, rightDescription }
        ),
    }

    return formulas[operator]
}

const ValidationRuleExpressionWithStaticDescription = ({ validationRule }) => {
    const { metaData: { leftSide, rightSide, operator } = {} } = validationRule

    const { displayDescription: leftDescription } = leftSide
    const { displayDescription: rightDescription } = rightSide

    const formulaToDisplay = buildExpressionDescription({
        operator,
        leftDescription,
        rightDescription,
    })

    if (!formulaToDisplay) {
        console.warn(
            `no matching validation rule expression for operator: ${operator}`
        )
        return null
    }

    return <span className={styles.formulaValue}>{formulaToDisplay}</span>
}

ValidationRuleExpressionWithStaticDescription.propTypes = {
    validationRule: ValidationRuleViolationWithMetaDataPropTypes,
}
export default ValidationRuleExpressionWithStaticDescription
