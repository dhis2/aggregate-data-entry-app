import { TextInput, TrueOnlyCheckbox, BooleanRadios } from './inputs.js'
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
} from './validators.js'

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
        validate: () => {}, // < 50,000 chars
        Input: TextInput,
    },
    LONG_TEXT: {
        validate: () => {},
        Input: TextInput, // Todo: Large text box
    },
    LETTER: {
        validate: () => {},
        Input: TextInput,
    },
    PHONE_NUMBER: {
        validate: internationalPhoneNumber,
        Input: TextInput,
    },
    EMAIL: {
        validate: email,
        Input: TextInput,
    },
    BOOLEAN: {
        validate: () => {},
        Input: BooleanRadios,
    },
    TRUE_ONLY: {
        validate: () => {},
        Input: TrueOnlyCheckbox,
    },
    DATE: {
        validate: () => {},
        Input: TextInput,
    },
    DATETIME: {
        validate: () => {},
        Input: TextInput,
    },
    TIME: {
        validate: () => {},
        Input: TextInput,
    },
    NUMBER: {
        validate: number,
        Input: TextInput,
    },
    UNIT_INTERVAL: {
        validate: () => {},
        Input: TextInput,
    },
    PERCENTAGE: {
        validate: percentage,
        Input: TextInput,
    },
    INTEGER: {
        validate: integer,
        Input: TextInput,
    },
    INTEGER_POSITIVE: {
        validate: integerPositive,
        Input: TextInput,
    },
    INTEGER_NEGATIVE: {
        validate: integerNegative,
        Input: TextInput,
    },
    INTEGER_ZERO_OR_POSITIVE: {
        validate: integerZeroOrPositive,
        Input: TextInput,
    },
    TRACKER_ASSOCIATE: {
        validate: () => {},
        Input: TextInput,
    },
    USERNAME: {
        validate: dhis2Username,
        Input: TextInput,
    },
    COORDINATE: {
        validate: () => {},
        Input: TextInput,
    },
    ORGANISATION_UNIT: {
        validate: () => {},
        Input: TextInput,
    },
    AGE: {
        validate: () => {},
        Input: TextInput,
    },
    URL: {
        validate: () => {},
        Input: TextInput,
    },
    FILE_RESOURCE: {
        validate: () => {},
        Input: TextInput,
    },
    IMAGE: {
        validate: () => {},
        Input: TextInput,
    },
})
