import i18n from '@dhis2/d2-i18n'
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
 * DATE
 * DATETIME
 */

export const text = createMaxCharacterLength(50000)
export const letter = createMaxCharacterLength(1)

// todo: revisit date & datetime validation for fallbacks
// decision: defer date & time validation for now, trust inputs for correct format
// if a browser doesn't support the input type, it falls back to a `text` input
// input types `date` and `time` started being supported by FF in '16 and Safari in '21
// input type `datetime-local` started being supported by FF and Safari in '21
// `datetime` is an uncommon value type, and Safari is probably not a common browser for DHIS2 users

// Years of any length > 0 accepted to avoid y10k problem
// YYYY(+)-MM-DD; doesn't check days against number in month, but BACKEND DOES
const dateRegex = /^[0-9]+-(0[1-9]|1[1-2])-(0[1-9]|[1-2][0-9]|3[0-1])$/
// HH:MM
const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/

export const date = (value) => {
    return dateRegex.test(value)
        ? undefined
        : 'Please provide a valid date in the format YYYY-MM-DD'
}
export const dateTime = (value) => {
    if (!value || value.lenth === 0) {
        return undefined
    }
    const [date, time] = value.split(' ')
    return dateRegex.test(date) && timeRegex.test(time)
        ? undefined
        : i18n.t(
              'Please provide a valid date and time in the format YYYY-MM-DD HH:MM'
          )
}
export const time = (value) =>
    timeRegex.test(value)
        ? undefined
        : i18n.t('Please provide a valid time in the format HH:MM')

export const integerPositive = composeValidators(integer, createMinNumber(1))
export const integerZeroOrPositive = composeValidators(
    integer,
    createMinNumber(0)
)
export const integerNegative = composeValidators(integer, createMaxNumber(-1))

export const percentage = createNumberRange(0, 100)
export const unitInterval = createNumberRange(0, 1)
