// imported from ui-forms directly to avoid deprecation
import { Checkbox } from '@dhis2/ui'
import { number } from '@dhis2/ui-forms'
import React from 'react'

// todo: might need to handle styles here
// todo: oof, gonna need to handle callback signatures btwn native inputs and UI elements

// Adapt UI components to final form's callbacks
const convertCallbackSignatures = (props) => ({
    ...props,
    onChange: (_, e) => props.onChange(e),
    onFocus: (_, e) => props.onFocus(e),
    onBlur: (_, e) => props.onBlur(e),
})

const TextInput = (props) => <input type="text" {...props} />
// todo: needs to send 'true' or null; can't send 'false'
const TrueOnlyCheckbox = (props) => (
    <Checkbox {...convertCallbackSignatures(props)} />
)

export const VALUE_TYPES = Object.freeze({
    TEXT: {
        validate: () => {},
        Input: TextInput,
    },
    LONG_TEXT: {
        validate: () => {},
        Input: TextInput, // Todo: Large text box
    },
    LETTER: { validate: () => {}, Input: TextInput },
    PHONE_NUMBER: {
        validate: () => {},
        Input: TextInput,
    },
    EMAIL: { validate: () => {}, Input: TextInput },
    BOOLEAN: {
        validate: () => {},
        Input: TextInput, // Todo: radios
        // ffFieldType: 'radio'
    },
    TRUE_ONLY: {
        validate: () => {},
        Input: TrueOnlyCheckbox,
        ffFieldType: 'checkbox',
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
    INTEGER: { validate: () => {}, Input: TextInput },
    INTEGER_POSITIVE: {
        validate: () => {},
        Input: TextInput,
    },
    INTEGER_NEGATIVE: {
        validate: () => {},
        Input: TextInput,
    },
    INTEGER_ZERO_OR_POSITIVE: {
        validate: () => {},
        Input: TextInput,
    },
    TRACKER_ASSOCIATE: {
        validate: () => {},
        Input: TextInput,
    },
    USERNAME: { validate: () => {}, Input: TextInput },
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

// These are the data value types found on the demo DB
// eslint-disable-next-line no-unused-vars
const prioritized = [
    'NUMBER',
    'TRUE_ONLY',
    'BOOLEAN',
    'INTEGER_POSITIVE',
    'INTEGER_ZERO_OR_POSITIVE',
    'INTEGER',
    'LONG_TEXT',
    'TIME',
    'DATE',
    'FILE_RESOURCE',
]
