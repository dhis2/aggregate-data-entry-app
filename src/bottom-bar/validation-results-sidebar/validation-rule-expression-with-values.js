import React from 'react'
import { ValidationRuleViolationWithMetaDataPropTypes } from './validation-result-prop-types.js'
import styles from './validation-rule-expression.module.css'

const operatorToDisplay = {
    equal_to: '==',
    not_equal_to: '!=',
    greater_than: '>',
    greater_than_or_equal_to: '>=',
    less_than: '<',
    less_than_or_equal_to: '<=',
}

const ValidationRuleExpressionWithValues = ({ validationRule }) => {
    const {
        leftsideValue,
        rightsideValue,
        metaData: { leftSide, rightSide, operator } = {},
    } = validationRule

    const { displayDescription: leftDescription } = leftSide
    const { displayDescription: rightDescription } = rightSide

    return (
        <>
            <span className={styles.formulaValue}>
                {leftDescription} ({leftsideValue})
            </span>{' '}
            {operatorToDisplay[operator] ?? operator}{' '}
            <span className={styles.formulaValue}>
                {rightDescription} ({rightsideValue})
            </span>
        </>
    )
}

ValidationRuleExpressionWithValues.propTypes = {
    validationRule: ValidationRuleViolationWithMetaDataPropTypes,
}
export default ValidationRuleExpressionWithValues
