import i18n from '@dhis2/d2-i18n'
import { integer } from '@dhis2/ui-forms'

/**
 * The `integer` validator of the `@dhis2/ui` library uses
 * `Number.isSafeInterger` to assess whether it the value is a valid integer or
 * not. The range allowed by that methid is -(2^53 - 1) to 2^53 - 1.
 *
 * The `isInteger` validator in the Java core uses the `isValid` method of
 * apache's `IntegerValidator` class (see
 * `dhis-2/dhis-support/dhis-support-system/src/main/java/org/hisp/dhis/system/util/MathUtils.java`),
 * which allows an integer range from
 * -2147483648 to 2147483647.
 *
 * This validator re-uses `@dhis2/ui`'s validator but restricts the integer to
 * the range allowed by the Java core.
 *
 * @param {string} value
 */
export function isInteger(value) {
    const error = integer(value)
    if (error) {
        return error
    }

    const valueAsNumber = parseInt(value, 10)
    const exceedsLowerBound = valueAsNumber < -2147483648
    const exceedsUpperBound = valueAsNumber > 2147483647
    if (exceedsLowerBound || exceedsUpperBound) {
        return i18n.t(
            'Integer numbers have to be in the range from -2147483648 to 2147483647'
        )
    }

    return undefined
}
