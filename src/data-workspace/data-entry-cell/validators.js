import {
    integer,
    createMinNumber,
    composeValidators,
    createMaxNumber,
    createNumberRange,
} from '@dhis2/ui-forms'

/**
 * todo:
 * TIME
 * DATE
 * FILE_RESOURCE?
 */

export * from '@dhis2/ui-forms'
export const integerPositive = composeValidators(integer, createMinNumber(1))
export const integerZeroOrPositive = composeValidators(
    integer,
    createMinNumber(0)
)
export const integerNegative = composeValidators(integer, createMaxNumber(-1))
export const percentage = createNumberRange(0, 100)
export const unitInterval = createNumberRange(0, 1)
