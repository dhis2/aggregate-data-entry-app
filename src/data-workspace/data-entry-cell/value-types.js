// imported from ui-forms directly to avoid deprecation
import { number } from '@dhis2/ui-forms'
import React from 'react'

// todo: might need to handle styles here
// todo: oof, gonna need to handle callback signatures btwn native inputs and UI elements

const TextInput = (props) => <input type="text" {...props} />

export const VALUE_TYPES = Object.freeze({
    TEXT: {
        validate: () => console.log('todo: validate'),
        Input: 'todo (regular text)',
    },
    LONG_TEXT: {
        validate: () => console.log('todo: validate'),
        Input: 'todo (large text box)',
    },
    LETTER: { validate: () => console.log('todo: validate'), Input: 'todo' },
    PHONE_NUMBER: {
        validate: () => console.log('todo: validate'),
        Input: 'todo',
    },
    EMAIL: { validate: () => console.log('todo: validate'), Input: 'todo' },
    BOOLEAN: {
        validate: () => console.log('todo: validate'),
        Input: 'todo (radios)',
    },
    TRUE_ONLY: {
        validate: () => console.log('todo: validate'),
        Input: 'todo (checkbox)',
    },
    DATE: { validate: () => console.log('todo: validate'), Input: 'todo' },
    DATETIME: { validate: () => console.log('todo: validate'), Input: 'todo' },
    TIME: { validate: () => console.log('todo: validate'), Input: 'todo' },
    NUMBER: { validate: number, Input: TextInput },
    UNIT_INTERVAL: {
        validate: () => console.log('todo: validate'),
        Input: 'todo',
    },
    PERCENTAGE: {
        validate: () => console.log('todo: validate'),
        Input: 'todo',
    },
    INTEGER: { validate: () => console.log('todo: validate'), Input: 'todo' },
    INTEGER_POSITIVE: {
        validate: () => console.log('todo: validate'),
        Input: 'todo',
    },
    INTEGER_NEGATIVE: {
        validate: () => console.log('todo: validate'),
        Input: 'todo',
    },
    INTEGER_ZERO_OR_POSITIVE: {
        validate: () => console.log('todo: validate'),
        Input: 'todo',
    },
    TRACKER_ASSOCIATE: {
        validate: () => console.log('todo: validate'),
        Input: 'todo',
    },
    USERNAME: { validate: () => console.log('todo: validate'), Input: 'todo' },
    COORDINATE: {
        validate: () => console.log('todo: validate'),
        Input: 'todo',
    },
    ORGANISATION_UNIT: {
        validate: () => console.log('todo: validate'),
        Input: 'todo',
    },
    AGE: { validate: () => console.log('todo: validate'), Input: 'todo' },
    URL: { validate: () => console.log('todo: validate'), Input: 'todo' },
    FILE_RESOURCE: {
        validate: () => console.log('todo: validate'),
        Input: 'todo',
    },
    IMAGE: { validate: () => console.log('todo: validate'), Input: 'todo' },
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
