import {
    integer,
    createMinNumber,
    composeValidators,
    createMaxNumber,
    createNumberRange,
    createMaxCharacterLength,
} from '@dhis2/ui-forms'

/**
 * todo:
 * TIME
 * DATE
 * DATETIME
 */

export const text = createMaxCharacterLength(50000)
export const letter = createMaxCharacterLength(1)
export const integerPositive = composeValidators(integer, createMinNumber(1))
export const integerZeroOrPositive = composeValidators(
    integer,
    createMinNumber(0)
)
export const integerNegative = composeValidators(integer, createMaxNumber(-1))
export const percentage = createNumberRange(0, 100)
export const unitInterval = createNumberRange(0, 1)
