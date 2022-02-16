import {
    email,
    number,
    integer,
    internationalPhoneNumber,
    url,
} from '@dhis2/ui-forms'
import {
    BasicInput,
    TrueOnlyCheckbox,
    BooleanRadios,
    OptionSet,
    withAddlProps,
    LongText,
} from './inputs.js'
import {
    text,
    letter,
    integerPositive,
    integerZeroOrPositive,
    integerNegative,
    percentage,
    unitInterval,
    // date,
    time,
    // dateTime,
} from './validators.js'

/** Use an OptionSet if relevant; else use input type below */
export function getInputByDataElement(de) {
    if (de.optionSetValue) {
        return OptionSet
    } else {
        return VALUE_TYPES[de.valueType].Input
    }
}

export const VALUE_TYPES = Object.freeze({
    TEXT: {
        validate: text,
        Input: BasicInput,
    },
    LONG_TEXT: {
        validate: null,
        Input: LongText,
    },
    LETTER: {
        validate: letter,
        Input: BasicInput,
    },
    PHONE_NUMBER: {
        validate: internationalPhoneNumber,
        Input: withAddlProps(BasicInput, { inputType: 'tel' }),
    },
    EMAIL: {
        validate: email,
        Input: withAddlProps(BasicInput, { inputType: 'email' }),
    },
    BOOLEAN: {
        validate: null,
        Input: BooleanRadios,
    },
    TRUE_ONLY: {
        validate: null,
        Input: TrueOnlyCheckbox,
    },
    DATE: {
        validate: null, // todo (in case browser doesn't support special input)
        Input: withAddlProps(BasicInput, { inputType: 'date' }),
    },
    DATETIME: {
        validate: null, // todo " "
        Input: withAddlProps(BasicInput, { inputType: 'datetime-local' }),
    },
    TIME: {
        validate: time,
        Input: withAddlProps(BasicInput, { inputType: 'time' }),
    },
    NUMBER: {
        validate: number,
        Input: BasicInput,
    },
    UNIT_INTERVAL: {
        validate: unitInterval,
        Input: BasicInput,
    },
    PERCENTAGE: {
        validate: percentage,
        Input: BasicInput,
    },
    INTEGER: {
        validate: integer,
        Input: BasicInput,
    },
    INTEGER_POSITIVE: {
        validate: integerPositive,
        Input: BasicInput,
    },
    INTEGER_NEGATIVE: {
        validate: integerNegative,
        Input: BasicInput,
    },
    INTEGER_ZERO_OR_POSITIVE: {
        validate: integerZeroOrPositive,
        Input: BasicInput,
    },
    URL: {
        validate: url,
        Input: withAddlProps(BasicInput, { inputType: 'url' }),
    },
    // todo
    FILE_RESOURCE: {
        validate: () => {},
        Input: BasicInput,
    },
    // todo
    IMAGE: {
        validate: () => {},
        Input: BasicInput,
    },
    // Value types not supported for aggregate data:
    // ORGANISATION_UNIT
    // TRACKER_ASSOCIATE
    // COORDINATE
    // USERNAME
    // AGE
})
