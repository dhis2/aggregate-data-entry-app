import { number, integer, createMinNumber, composeValidators } from '@dhis2/ui-forms'

/**
 * todo:
 * TIME
 * DATE
 * FILE_RESOURCE?
 */

export { number, integer }
export const integerPositive = composeValidators(integer, createMinNumber(1))
export const integerZeroOrPositive = composeValidators(
    integer,
    createMinNumber(0)
)
