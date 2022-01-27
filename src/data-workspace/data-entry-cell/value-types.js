import i18n from '@dhis2/d2-i18n'
import { Checkbox, Radio, Button } from '@dhis2/ui'
// imported from ui-forms directly to avoid deprecation
import { number } from '@dhis2/ui-forms'
import PropTypes from 'prop-types'
import React from 'react'
import { useField, useForm } from 'react-final-form'

// todo: refactor styles here

// Adapt UI components to Final Form's callbacks
const convertCallbackSignatures = (props) => ({
    ...props,
    onChange: (_, e) => props.onChange(e),
    onFocus: (_, e) => props.onFocus(e),
    onBlur: (_, e) => props.onBlur(e),
})

const TextInput = (props) => <input type="text" {...props} />
const InputProps = {
    name: PropTypes.string.isRequired,
    syncData: PropTypes.func.isRequired,
    className: PropTypes.string,
    lastSyncedValue: PropTypes.any,
    onKeyDown: PropTypes.func,
}

const TrueOnlyCheckbox = ({ name, syncData, className, onKeyDown, lastSyncedValue }) => {
    const { input, meta } = useField(name, {
        type: 'checkbox',
        subscription: { value: true, dirty: true, valid: true },
    })

    // todo: clicking outside the checkbox but in the cell changes the value but also
    // triggers onBlur - clicking on checkbox itself only changes the value

    const handleBlur = () => {
        // For 'True only', can only send 'true' (or '1') or ''
        const value = input.checked ? 'true' : ''
        const { dirty, valid } = meta
        if (dirty && valid && value !== lastSyncedValue) {
            syncData(value)
        }
    }
    const checkboxProps = convertCallbackSignatures(input)

    return (
        <div style={{ height: '100%', width: '100%' }} onKeyDown={onKeyDown}>
            <Checkbox
                className={className}
                {...checkboxProps}
                onBlur={(e) => {
                    handleBlur()
                    input.onBlur(e)
                }}
            />
        </div>
    )
}
TrueOnlyCheckbox.propTypes = InputProps

// Looks like this needs TWO useField instances...
// ? Will this fail to reflect a value on the server if it's not exactly `true` or `false`?
// todo: may need to handle that when mapping server values to form initial values, e.g.
// boolean: accepts 1, 0, 'true', 'false'
// if (dv.valueType === boolean) { formValue = dv.value ... etc }
// does `isEqual` prop help make 1/true and 0/false/'' equal?
const BooleanRadios = ({
    name,
    syncData,
    className,
    lastSyncedValue,
    onKeyDown,
}) => {
    const yesField = useField(name, {
        type: 'radio',
        value: 'true',
        subscription: { value: true },
    })
    const noField = useField(name, {
        type: 'radio',
        value: 'false',
        subscription: { value: true },
    })
    // Used for the 'clear' button, but works
    const clearField = useField(name, {
        type: 'radio',
        value: '',
        subscription: { value: true },
    })
    const form = useForm()

    const clearButtonProps = convertCallbackSignatures(clearField.input)
    delete clearButtonProps.type
    // Is there an imperative way to set the field value?
    // A: ya, form.change(name, value) - but the other input props are useful

    const handleBlur = () => {
        const fieldState = form.getFieldState(name)
        const { dirty, valid } = fieldState
        const value = fieldState.value || ''
        // If this value has changed, sync it to server if valid
        if (dirty && valid && value !== lastSyncedValue) {
            syncData(value)
        }
    }

    return (
        <div
            className={className}
            style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '8px',
            }}
            // Keydown for keyboard nav works nicely on wrapper
            onKeyDown={onKeyDown}
        >
            <Radio
                label={i18n.t('Yes')}
                value={'true'}
                {...convertCallbackSignatures(yesField.input)}
                onBlur={(_, e) => {
                    handleBlur()
                    yesField.input.onBlur(e)
                }}
            />
            <Radio
                label={i18n.t('No')}
                value={'false'}
                {...convertCallbackSignatures(noField.input)}
                onBlur={(_, e) => {
                    handleBlur()
                    noField.input.onBlur(e)
                }}
            />
            <Button
                small
                {...clearButtonProps}
                onClick={clearButtonProps.onChange}
                onBlur={(_, e) => {
                    handleBlur()
                    clearField.input.onBlur(e)
                }}
            >
                {i18n.t('Clear')}
            </Button>
        </div>
    )
}
BooleanRadios.propTypes = InputProps

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
        Input: BooleanRadios,
        ffFieldType: 'radio',
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
