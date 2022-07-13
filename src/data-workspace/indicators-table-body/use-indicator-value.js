import { Parser } from 'expr-eval'
import { useMemo, useState, useEffect } from 'react'
import { useForm } from 'react-final-form'
import { useBlurredField } from '../../shared/index.js'

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
const evaluate = (expression) => parser.parse(expression).evaluate()

/*
 * In an indicator expression template an `id` can have one of these shapes:
 * 1. #{deId} for a data element
 * 2. #{deId.cocId} for a category option combo
 */
const idInterpolationPattern = /#\{.+?\}/g
const idSeparator = '.'

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
    const matches = expression.match(idInterpolationPattern)

    /*
     * Not all expression templates contain references to data elements
     * and/or category combo options. They can also be plain string
     * representations of numerical values, i.e. `'4.23'`
     */
    if (!matches?.length > 0) {
        return expression
    }

    return matches.reduce((substitudedExpression, match) => {
        const id = match.replace(/[#{}]/g, '')
        const isDataElement = !id.includes(idSeparator)
        const value =
            (isDataElement
                ? // For data elements we need the sum of all COCs
                  getDataElementTotalValue(values[id])
                : values[id]) || 0

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
const computeIndicatorValue = ({
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

    return (numeratorValue / denominatorValue) * factor
}

/**
 * Reach hook which provides the consuming component with a computed indicator
 * value. This hook will only recompute this value when a value for a related
 * data element changes.
 * @param {Object} options
 * @param {string} options.denominator Indicator expression template
 * @param {string} options.numerator Indicator expression template
 * @param {number} options.factor Indicator multiplier
 * @returns {number} Indicator value
 */
export const useIndicatorValue = ({ denominator, numerator, factor }) => {
    const form = useForm()
    const [value, setValue] = useState(() =>
        computeIndicatorValue({
            denominator,
            numerator,
            factor,
            formState: form.getState(),
        })
    )
    const blurredField = useBlurredField()
    const affectedDataElementsLookup = useMemo(
        () =>
            [denominator, numerator].reduce((lookup, expression) => {
                const matches = expression.match(idInterpolationPattern)
                if (matches?.length > 0) {
                    for (const match of matches) {
                        const dataElementId = match
                            .replace(/[#{}]/g, '')
                            .split(idSeparator)[0]
                        lookup.add(dataElementId)
                    }
                }
                return lookup
            }, new Set()),
        [denominator, numerator]
    )

    useEffect(() => {
        /*
         * Only recompute the indicator value when a field related to
         * a data element in the indicator expression template is blurred.
         */
        const dataElementId = blurredField?.split(idSeparator)[0]
        const containsAffectedDataElement =
            affectedDataElementsLookup.has(dataElementId)
        if (containsAffectedDataElement) {
            setValue(
                computeIndicatorValue({
                    denominator,
                    numerator,
                    factor,
                    formState: form.getState(),
                })
            )
        }
    }, [
        blurredField,
        affectedDataElementsLookup,
        denominator,
        numerator,
        factor,
        form,
    ])

    return value
}
