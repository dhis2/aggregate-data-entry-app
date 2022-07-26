import cx from 'classnames'
import PropTypes from 'prop-types'
import React from 'react'
import styles from './validation-priority-group.module.css'
import { ValidationRuleViolationWithMetaDataPropTypes } from './validation-result-prop-types.js'
import ValidationRuleExpression from './validation-rule-expression.js'

export default function ValidationViolations({ validationViolations, className }) {
    return (
        <>
            {validationViolations.map((validationRule) => {
                return (
                    <div
                        className={cx(styles.priorityGroupBox, className)}
                        key={validationRule.metaData.id}
                    >
                        <div>{validationRule.metaData.displayInstruction}</div>
                        <div className={styles.formula}>
                            <ValidationRuleExpression
                                validationRule={validationRule}
                            />
                        </div>
                    </div>
                )
            })}
        </>
    )
}

ValidationViolations.propTypes = {
    className: PropTypes.string.isRequired,
    validationViolations: PropTypes.arrayOf(
        ValidationRuleViolationWithMetaDataPropTypes
    ).isRequired,
}
