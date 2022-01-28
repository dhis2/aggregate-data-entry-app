import { TextInput, TrueOnlyCheckbox, BooleanRadios } from './inputs.js'
import {
    number,
    integer,
    integerPositive,
    integerZeroOrPositive,
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
    LETTER: { validate: () => {}, Input: TextInput },
    PHONE_NUMBER: {
        validate: () => {}, // international phone number
        Input: TextInput,
    },
    EMAIL: { validate: () => {}, Input: TextInput },
    BOOLEAN: {
        validate: () => {},
        Input: BooleanRadios,
    },
    TRUE_ONLY: {
        validate: () => {},
        Input: TrueOnlyCheckbox,
    },
    DATE: { validate: () => {}, Input: TextInput },
    DATETIME: { validate: () => {}, Input: TextInput },
    TIME: { validate: () => {}, Input: TextInput },
    NUMBER: { validate: number, Input: TextInput },
    UNIT_INTERVAL: {
        validate: () => {},
        Input: TextInput,
    },
    PERCENTAGE: {
        validate: () => {},
        Input: TextInput,
    },
    INTEGER: { validate: integer, Input: TextInput },
    INTEGER_POSITIVE: {
        validate: integerPositive,
        Input: TextInput,
    },
    INTEGER_NEGATIVE: {
        validate: () => {},
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
    USERNAME: { validate: () => {}, Input: TextInput }, //dhis2Username
    COORDINATE: {
        validate: () => {},
        Input: TextInput,
    },
    ORGANISATION_UNIT: {
        validate: () => {},
        Input: TextInput,
    },
    AGE: { validate: () => {}, Input: TextInput },
    URL: { validate: () => {}, Input: TextInput },
    FILE_RESOURCE: {
        validate: () => {},
        Input: TextInput,
    },
    IMAGE: { validate: () => {}, Input: TextInput },
})
