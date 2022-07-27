import i18n from '@dhis2/d2-i18n'
import { ValidationRuleViolationWithMetaDataPropTypes } from './validation-result-prop-types.js'

// @ToDO: confirm the human readable equivalent for the operators
const operatorDisplay = {
    equal_to: '==',
    not_equal_to: '!=',
    greater_than: '>',
    greater_than_or_equal_to: '>=',
    less_than: '<',
    less_than_or_equal_to: '<=',
    compulsory_pair: i18n.t('is compulsory with'),
    exclusive_pair: i18n.t('is exclusive to'),
}

const ValidationRuleExpression = ({ validationRule }) => {
    const {
        leftsideValue,
        rightsideValue,
        metaData: { leftSide, rightSide, operator } = {},
    } = validationRule

    return `${leftSide.displayDescription} (${leftsideValue}) ${
        operatorDisplay[operator] ?? operator
    } ${rightSide.displayDescription} (${rightsideValue})`
}

ValidationRuleExpression.propTypes = {
    validationRule: ValidationRuleViolationWithMetaDataPropTypes,
}
export default ValidationRuleExpression
