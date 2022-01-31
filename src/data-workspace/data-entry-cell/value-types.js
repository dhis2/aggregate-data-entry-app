import {
    BasicInput,
    TrueOnlyCheckbox,
    BooleanRadios,
    OptionSet,
    withInputType,
} from './inputs.js'
import {
    dhis2Username,
    email,
    number,
    integer,
    integerPositive,
    integerZeroOrPositive,
    integerNegative,
    internationalPhoneNumber,
    percentage,
    url,
    unitInterval,
} from './validators.js'

/** Use an OptionSet if relevant; else use input type below */
export function getInputByDataElement(de) {
    if (de.optionSetValue) {
        return OptionSet
    } else {
        return VALUE_TYPES[de.valueType].Input
    }
}

// todo: remove these when done
// These are the data value types found on the demo DB
// eslint-disable-next-line no-unused-vars
const prioritized = [
    'NUMBER',
    'TRUE_ONLY',
    'BOOLEAN',
    'INTEGER',
    'INTEGER_POSITIVE',
    'INTEGER_ZERO_OR_POSITIVE',
    'LONG_TEXT',
    'TIME', // needs validator (and input?)
    'DATE', // needs validator (and input?)
    'FILE_RESOURCE', // needs input
]

export const VALUE_TYPES = Object.freeze({
    TEXT: {
        validate: () => {}, // todo: < 50,000 chars
        Input: BasicInput,
    },
    LONG_TEXT: {
        validate: () => {},
        Input: BasicInput, // Todo: Large text box
    },
    LETTER: {
        validate: () => {}, // todo
        Input: BasicInput,
    },
    PHONE_NUMBER: {
        validate: internationalPhoneNumber,
        Input: withInputType(BasicInput, 'tel'),
    },
    EMAIL: {
        validate: email,
        Input: withInputType(BasicInput, 'email'),
    },
    BOOLEAN: {
        validate: () => {}, // todo?
        Input: BooleanRadios,
    },
    TRUE_ONLY: {
        validate: () => {}, // todo?
        Input: TrueOnlyCheckbox,
    },
    DATE: {
        validate: () => {}, // todo (in case browser doesn't support special input)
        Input: withInputType(BasicInput, 'date'),
    },
    DATETIME: {
        validate: () => {}, // todo (in case browser doesn't support special input)
        Input: withInputType(BasicInput, 'datetime-local'),
    },
    TIME: {
        validate: () => {}, // todo (in case browser doesn't support special input)
        Input: withInputType(BasicInput, 'time'),
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
    TRACKER_ASSOCIATE: {
        // todo
        validate: () => {},
        Input: BasicInput,
    },
    USERNAME: {
        validate: dhis2Username,
        Input: BasicInput,
    },
    COORDINATE: {
        // todo
        validate: () => {},
        Input: BasicInput,
    },
    ORGANISATION_UNIT: {
        // todo
        validate: () => {},
        Input: BasicInput,
    },
    AGE: {
        // todo
        validate: () => {},
        Input: BasicInput,
    },
    URL: {
        validate: url,
        Input: withInputType(BasicInput, 'url'),
    },
    FILE_RESOURCE: {
        // todo
        validate: () => {},
        Input: BasicInput,
    },
    IMAGE: {
        // todo
        validate: () => {},
        Input: BasicInput,
    },
})
