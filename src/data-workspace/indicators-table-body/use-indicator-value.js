import { useMemo, useRef } from 'react'
import { parseFieldId as parseFieldOperand } from '../get-field-id.js'
import {
    computeIndicatorValue,
    operandInterpolationPattern,
} from './compute-indicator-value.js'

/**
 * React hook which provides the consuming component with a computed indicator
 * value. This hook will only recompute this value when a value for a related
 * data element changes.
 * @param {Object} options
 * @param {string} options.blurredField The key of the blurred field
 * @param {string} options.denominator Indicator expression template
 * @param {number} options.factor Indicator multiplier
 * @param {Object} options.form Form instance returned by `useForm()`
 * @param {string} options.numerator Indicator expression template
 * @returns {number} Indicator value
 */
export const useIndicatorValue = ({
    blurredField,
    denominator,
    factor,
    form,
    numerator,
}) => {
    const indicatorValueRef = useRef(null)
    const affectedDataElementsLookup = useMemo(
        () =>
            [denominator, numerator].reduce((lookup, expression) => {
                const matches = expression.match(operandInterpolationPattern)
                if (matches?.length > 0) {
                    for (const match of matches) {
                        const { dataElementId } = parseFieldOperand(
                            match.replace(/[#{}]/g, '')
                        )
                        lookup.add(dataElementId)
                    }
                }
                return lookup
            }, new Set()),
        [denominator, numerator]
    )

    return useMemo(() => {
        /*
         * Only recompute the indicator value when a field related to
         * a data element in the indicator expression template is blurred.
         */
        const { dataElementId } = parseFieldOperand(blurredField)
        const containsAffectedDataElement =
            affectedDataElementsLookup.has(dataElementId)

        if (indicatorValueRef.current === null || containsAffectedDataElement) {
            indicatorValueRef.current = computeIndicatorValue({
                denominator,
                numerator,
                factor,
                formState: form.getState(),
            })
        }

        return indicatorValueRef.current
    }, [
        affectedDataElementsLookup,
        blurredField,
        denominator,
        factor,
        form,
        numerator,
    ])
}
