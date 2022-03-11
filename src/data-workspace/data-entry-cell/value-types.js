import {
    email,
    number,
    integer,
    internationalPhoneNumber,
    url,
} from '@dhis2/ui-forms'
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
} from '../data-entry-cell/validators.js'
import {
    BasicInput,
    TrueOnlyCheckbox,
    BooleanRadios,
    withAdditionalProps,
    LongText,
    FileResourceInput,
    ImageInput,
} from '../inputs/index.js'

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
        Input: withAdditionalProps(BasicInput, { inputType: 'tel' }),
    },
    EMAIL: {
        validate: email,
        Input: withAdditionalProps(BasicInput, { inputType: 'email' }),
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
        Input: withAdditionalProps(BasicInput, { inputType: 'date' }),
    },
    DATETIME: {
        validate: null, // todo " "
        Input: withAdditionalProps(BasicInput, { inputType: 'datetime-local' }),
    },
    TIME: {
        validate: time,
        Input: withAdditionalProps(BasicInput, { inputType: 'time' }),
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
        Input: withAdditionalProps(BasicInput, { inputType: 'url' }),
    },
    FILE_RESOURCE: {
        validate: null, // todo
        Input: FileResourceInput,
    },
    IMAGE: {
        validate: null, // todo
        Input: ImageInput,
    },
    // Value types not supported for aggregate data:
    // ORGANISATION_UNIT
    // TRACKER_ASSOCIATE
    // COORDINATE
    // USERNAME
    // AGE
})
