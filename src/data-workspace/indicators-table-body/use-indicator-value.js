import { useMemo, useState, useEffect } from 'react'
import {
    computeIndicatorValue,
    idInterpolationPattern,
    idSeparator,
} from './compute-indicator-value.js'

/**
 * Reach hook which provides the consuming component with a computed indicator
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
    const [value, setValue] = useState(() =>
        computeIndicatorValue({
            denominator,
            numerator,
            factor,
            formState: form.getState(),
        })
    )
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
        affectedDataElementsLookup,
        blurredField,
        denominator,
        factor,
        form,
        numerator,
    ])

    return value
}
