import { Parser } from 'expr-eval'
import { useMemo, useState, useEffect } from 'react'
import { useForm } from 'react-final-form'
import { useBlurredField } from '../../shared/index.js'

const parser = new Parser()
const evaluate = (expression) => parser.parse(expression).evaluate()
const formulaPattern = /#\{.+?\}/g
const separator = '.'

const getDataElementTotalValue = (dataElementCocs) => {
    if (!dataElementCocs || typeof dataElementCocs !== 'object') {
        return 0
    }

    return Object.values(dataElementCocs).reduce((sum, value) => {
        if (!isNaN(value)) {
            sum = sum + Number(value)
        }
        return sum
    }, 0)
}

const parseExpression = (expression, values) => {
    const matches = expression.match(formulaPattern)

    if (!matches?.length > 0) {
        return expression
    }

    return matches.reduce((substitudedExpression, match) => {
        const id = match.replace(/[#{}]/g, '')
        const isDataElement = !id.includes(separator)
        const value =
            (isDataElement
                ? getDataElementTotalValue(values[id])
                : values[id]) || 0

        return substitudedExpression.replace(match, value)
    }, expression)
}

const computeIndicatorValue = ({
    denominator,
    numerator,
    factor,
    formState,
}) => {
    const denominatorExpression = parseExpression(denominator, formState.values)
    const numeratorExpression = parseExpression(numerator, formState.values)

    return (
        (evaluate(numeratorExpression) / evaluate(denominatorExpression)) *
        factor
    )
}

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
                const matches = expression.match(formulaPattern)
                if (matches?.length > 0) {
                    for (const match of matches) {
                        const dataElementId = match
                            .replace(/[#{}]/g, '')
                            .split(separator)[0]
                        lookup.add(dataElementId)
                    }
                }
                return lookup
            }, new Set()),
        [denominator, numerator]
    )

    useEffect(() => {
        const dataElementId = blurredField?.split(separator)[0]
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
