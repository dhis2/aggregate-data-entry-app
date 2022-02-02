import i18n from '@dhis2/d2-i18n'
import {
    Checkbox,
    Radio,
    Button,
    SingleSelect,
    SingleSelectOption,
} from '@dhis2/ui'
import cx from 'classnames'
import PropTypes from 'prop-types'
import React from 'react'
import { useField, useForm } from 'react-final-form'
import { useMetadata } from '../../metadata/index.js'
import { getOptionSetById } from '../../metadata/selectors.js'
import styles from './inputs.module.css'

// todo: refactor styles here

// Adapt UI components to Final Form's callbacks
const convertCallbackSignatures = (props) => ({
    ...props,
    onChange: (_, e) => props.onChange(e),
    onFocus: (_, e) => props.onFocus(e),
    onBlur: (_, e) => props.onBlur(e),
})

export const withInputType = (Component, inputType) => {
    return function InputWithType(props) {
        return <Component {...props} inputType={inputType} />
    }
}

export const BasicInput = ({
    name,
    syncData,
    className,
    onKeyDown,
    lastSyncedValue,
    inputType,
}) => {
    const { input, meta } = useField(name, {
        type: inputType,
        subscription: { value: true, dirty: true, valid: true },
    })

    const handleBlur = () => {
        const { value } = input
        const { dirty, valid } = meta
        if (dirty && valid && value !== lastSyncedValue) {
            syncData(value)
        }
    }

    return (
        <input
            className={className}
            {...input}
            onBlur={(e) => {
                handleBlur()
                input.onBlur(e)
            }}
            onKeyDown={onKeyDown}
        />
    )
}
const InputProps = {
    name: PropTypes.string.isRequired,
    syncData: PropTypes.func.isRequired,
    className: PropTypes.string,
    lastSyncedValue: PropTypes.any,
    onKeyDown: PropTypes.func,
}
BasicInput.propTypes = { ...InputProps, inputType: PropTypes.string }

export const TrueOnlyCheckbox = ({
    name,
    syncData,
    className,
    onKeyDown,
    lastSyncedValue,
}) => {
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

    return (
        <div style={{ height: '100%', width: '100%' }} onKeyDown={onKeyDown}>
            <Checkbox
                className={className}
                {...convertCallbackSignatures(input)}
                onBlur={(e) => {
                    handleBlur()
                    input.onBlur(e)
                }}
            />
        </div>
    )
}
TrueOnlyCheckbox.propTypes = InputProps

// ? Will this fail to reflect a value on the server if it's not exactly `true` or `false`?
// todo: may need to handle that when mapping server values to form initial values, e.g.
// Currently it's working okay
// boolean: accepts 1, 0, 'true', 'false'
// Ex: if (dv.valueType === boolean) { formValue = dv.value ... etc }
// does `isEqual` prop help make 1/true and 0/false/'' equal?
export const BooleanRadios = ({
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

export const OptionSet = ({
    name,
    syncData,
    className,
    lastSyncedValue,
    onKeyDown,
    dataElement,
}) => {
    const { input } = useField(name, { subscription: { value: true } })
    const { metadata } = useMetadata()

    const handleChange = (value) => {
        // For a select using onChange, don't need to check valid or dirty, respectively
        if (value !== lastSyncedValue) {
            syncData(value)
        }
    }

    const optionSet = getOptionSetById(metadata, dataElement.optionSet.id)
    // filter out 'null' options
    const options = optionSet.options.filter((opt) => !!opt)

    // todo: can't be accessed by focusPrev and focusNext because it's not an input
    // onBlur handler doesn't work
    // Why is there not an `input` element in the component tree? onBlur doesn't really work (should be called on close)
    // When using `clearble` prop, the clear button should have some margin-left & lose the margin-right - on .root-children .root-right
    return (
        <div
            onKeyDown={onKeyDown}
            className={cx(className, styles.selectFlexWrapper)}
        >
            <div className={styles.selectFlexItem}>
                <SingleSelect
                    dense
                    className={styles.select}
                    name={input.name}
                    placeholder={i18n.t('Choose an option')}
                    selected={input.value || ''}
                    onChange={({ selected }) => {
                        input.onChange(selected)
                        handleChange(selected)
                    }}
                    onFocus={() => {
                        // onBlur here helps buggy onFocus work correctly
                        input.onBlur()
                        input.onFocus()
                    }}
                    onBlur={() => input.onBlur()}
                >
                    {options.map(({ name }) => (
                        <SingleSelectOption
                            key={name}
                            label={name}
                            value={name}
                        />
                    ))}
                </SingleSelect>
            </div>
            {input.value && (
                <Button
                    small
                    {...input}
                    onClick={() => {
                        input.onChange('')
                        handleChange('')
                    }}
                >
                    {i18n.t('Clear')}
                </Button>
            )}
        </div>
    )
}
OptionSet.propTypes = {
    ...InputProps,
    dataElement: PropTypes.shape({
        optionSet: PropTypes.shape({ id: PropTypes.string }),
        valueType: PropTypes.string,
    }).isRequired,
}
