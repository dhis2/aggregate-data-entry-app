import { Parser } from 'expr-eval'
import { getIn } from 'final-form'
import { parseFieldId as parseFieldOperand } from '../get-field-id.js'

/**
 * --- INDICATOR VALUE CALCULATION ---
 * The general formula for computing an indicator value is:
 * (numerator / denominator) * factor
 * The values for the `numerator` and `denominator` are obtained by
 * parsing an expression template string and then evaluating the
 * resulting arithmetic expression.
 * The `factor` is provided as a numerical value so that can just be
 * used directly.
 */
// Use a mathematical expression parser instead of `eval`
const parser = new Parser()
const evaluate = (expression) => {
    try {
        return parser.parse(expression).evaluate()
    } catch {
        return ''
    }
}
/*
 * In an indicator expression template an `operand` can have one of these shapes:
 * 1. #{deId} for a data element
 * 2. #{deId.cocId} for a category option combo
 */
export const operandInterpolationPattern = /#\{.+?\}/g

/**
 * Calculates the sum of category option combos in a data element
 * @param {Object.<string, string>} dataElementCocValues A data element object from ReactFinalForm `values`
 * @returns {number} The sum of form values, ignoring non-numerical values
 */
const getDataElementTotalValue = (dataElementCocValues) => {
    if (!dataElementCocValues || typeof dataElementCocValues !== 'object') {
        return 0
    }

    return Object.values(dataElementCocValues).reduce((sum, value) => {
        if (!isNaN(value)) {
            sum = sum + Number(value)
        }
        return sum
    }, 0)
}
/**
 * Populates an expression template with values
 *
 * @example
 * // returns `'3+2*3'`
 * const expressionTemplate = '#{hfdmMSPBgLG}+#{ImspTQPwCqd.PT59n8BQbqM}*#{Jtf34kNZhzP.pq2XI5kz2BY}'
 * const values = {
 *     hfdmMSPBgLG: {
 *         fbfJHSPpUQD: '1',
 *         cYeuwXTCPkU: '2',
 *     },
 *     ImspTQPwCqd: {
 *         PT59n8BQbqM: '2',
 *     },
 *     Jtf34kNZhzP: {
 *         pq2XI5kz2BY: '3',
 *     },
 * }
 * parseExpressionTemplate(expressionTemplate, values)
 *
 * @param {string} expressionTemplate An indicator expression template
 * @param {Object} values ReactFinalForm `values`
 * @returns {string} a parsed expression template
 */
const parseExpressionTemplate = (expression, values) => {
    const matches = expression.match(operandInterpolationPattern)

    /*
     * Not all expression templates contain references to data elements
     * and/or category combo options. They can also be plain string
     * representations of numerical values, i.e. `'4.23'`
     */
    if (!matches?.length > 0) {
        return expression
    }

    return matches.reduce((substitudedExpression, match) => {
        const operand = match.replace(/[#{}]/g, '')
        const { categoryOptionComboId } = parseFieldOperand(operand)
        const value =
            (categoryOptionComboId
                ? // For COCs we read the data directly from the form values
                  getIn(values, operand)
                : // For data elements we need the sum of all COC form values
                  getDataElementTotalValue(values[operand])) || 0

        return substitudedExpression.replace(match, value)
    }, expression)
}
/**
 * Parses and evaluates the denominator and numerator expressions
 * and then computes the indicator value
 * @param {Object} options
 * @param {string} options.denominator Indicator expression template
 * @param {string} options.numerator Indicator expression template
 * @param {number} options.factor Indicator multiplier
 * @param {{values: object}} options.formState ReactFinalForm formState
 * @returns {number} Indicator value
 */

export const computeIndicatorValue = ({
    denominator,
    numerator,
    factor,
    formState,
}) => {
    const numeratorExpression = parseExpressionTemplate(
        numerator,
        formState.values
    )
    const denominatorExpression = parseExpressionTemplate(
        denominator,
        formState.values
    )
    const numeratorValue = evaluate(numeratorExpression)
    const denominatorValue = evaluate(denominatorExpression)
    const indicatorValue = (numeratorValue / denominatorValue) * factor
    const isReadableNumber = isFinite(indicatorValue) && !isNaN(indicatorValue)

    return isReadableNumber ? indicatorValue : ''
}
