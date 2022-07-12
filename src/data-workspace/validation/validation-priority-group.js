import i18n from '@dhis2/d2-i18n'
import cx from 'classnames'
import PropTypes from 'prop-types'
import React from 'react'
import { validationLevelsConfig } from './validation-config.js'
import styles from './validation-priority-group.module.css'
import {
    ImportanceLevelPropTypes,
    ValidationRuleViolationWithMetaDataPropTypes,
} from './validation-result-prop-types.js'

const ValidationPriortyGroup = ({ level, validationViolations = [] }) => {
    if (validationViolations?.length === 0) {
        return null
    }

    const validationConfig = validationLevelsConfig[level]

    const validationViolationBoxStyle = cx(
        styles.priorityGroupBox,
        styles[validationConfig.style]
    )

    const Icon = validationConfig.largeIcon
    const iconStyle = cx(styles.icon, styles[`${validationConfig.style}Icon`])

    const buildDisplayFormula = (validationRule = {}) => {
        const {
            leftsideValue,
            rightsideValue,
            metaData: { leftSide, rightSide, operator } = {},
        } = validationRule

        // @ToDO: confirm the human readable equivalent for the operators
        const operatorDisplay = {
            equal_to: '==',
            not_equal_to: '!=',
            greater_than: '>',
            greater_than_or_equal_to: '>=',
            less_than: '<',
            less_than_or_equal_to: '<=',
            compulsory_pair: 'is compulsory with',
            exclusive_pair: 'is exclusive to',
        }
        return `${leftSide.displayDescription} (${leftsideValue}) ${
            operatorDisplay[operator] ?? operator
        } ${rightSide.displayDescription} (${rightsideValue})`
    }

    const translationOptons = {
        level: validationConfig.text?.toLowerCase(),
        length: validationViolations.length,
    }

    return (
        <div data-test={`priority-group-${level}`}>
            <div className={styles.titleWrapper}>
                <div className={iconStyle}>
                    <Icon color={validationConfig.iconColor} />
                </div>
                <h1>
                    {validationViolations.length === 1
                        ? i18n.t(
                              '{{length}} {{level}} priority alert',
                              translationOptons
                          )
                        : i18n.t(
                              '{{length}} {{level}} priority alerts',
                              translationOptons
                          )}
                </h1>
            </div>
            {validationViolations.map((validationRule) => {
                return (
                    <div
                        className={validationViolationBoxStyle}
                        key={validationRule.metaData.id}
                    >
                        <div>{validationRule.metaData.displayInstruction}</div>
                        <div className={styles.formula}>
                            {buildDisplayFormula(validationRule)}
                        </div>
                    </div>
                )
            })}
        </div>
    )
}

ValidationPriortyGroup.propTypes = {
    level: ImportanceLevelPropTypes.isRequired,
    validationViolations: PropTypes.arrayOf(
        ValidationRuleViolationWithMetaDataPropTypes
    ),
}
export default ValidationPriortyGroup
