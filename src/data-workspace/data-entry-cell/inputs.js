import i18n from '@dhis2/d2-i18n'
import {
    Button,
    Checkbox,
    Radio,
    SingleSelect,
    SingleSelectOption,
} from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import { useField, useForm } from 'react-final-form'
import { useMetadata } from '../../metadata/index.js'
import { getOptionSetById } from '../../metadata/selectors.js'
import styles from './inputs.module.css'

// Adapt UI components to Final Form's callbacks
const convertCallbackSignatures = (props) => ({
    ...props,
    onChange: (_, e) => props.onChange(e),
    onFocus: (_, e) => props.onFocus(e),
    onBlur: (_, e) => props.onBlur(e),
})

export const withAddlProps = (Component, addlProps) => {
    return function InputWithAddlProps(props) {
        return <Component {...props} {...addlProps} />
    }
}

export const BasicInput = ({
    name,
    syncData,
    onKeyDown,
    lastSyncedValue,
    inputType,
}) => {
    const { input, meta } = useField(name, {
        // input type gets added to native `input` attributes:
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
            className={styles.basicInput}
            {...input}
            onBlur={(e) => {
                handleBlur()
                input.onBlur(e)
            }}
            onKeyDown={onKeyDown}
        />
    )
}
const InputPropTypes = {
    name: PropTypes.string.isRequired,
    syncData: PropTypes.func.isRequired,
    lastSyncedValue: PropTypes.any,
    onKeyDown: PropTypes.func,
}
BasicInput.propTypes = {
    ...InputPropTypes,
    inputType: PropTypes.string,
}

export const LongText = ({ name, syncData, onKeyDown, lastSyncedValue }) => {
    const { input, meta } = useField(name, {
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
        <textarea
            className={styles.longText}
            rows="4"
            {...input}
            onBlur={(e) => {
                handleBlur()
                input.onBlur(e)
            }}
            onKeyDown={onKeyDown}
        />
    )
}
LongText.propTypes = InputPropTypes

export const TrueOnlyCheckbox = ({
    name,
    syncData,
    onKeyDown,
    lastSyncedValue,
}) => {
    const { input, meta } = useField(name, {
        type: 'checkbox',
        subscription: { value: true, dirty: true, valid: true },
    })

    // todo: checking then unchecking the box will send a single unnecessary POST
    const handleBlur = () => {
        // For 'True only', can only send 'true' (or '1') or ''
        const value = input.checked ? 'true' : ''
        const { dirty, valid } = meta
        if (dirty && valid && value !== lastSyncedValue) {
            syncData(value)
        }
    }

    return (
        <div className={styles.checkboxWrapper} onKeyDown={onKeyDown}>
            <Checkbox
                dense
                {...convertCallbackSignatures(input)}
                onBlur={(e) => {
                    handleBlur()
                    input.onBlur(e)
                }}
            />
        </div>
    )
}
TrueOnlyCheckbox.propTypes = InputPropTypes

// ? Will this fail to reflect a value on the server if it's not exactly `true` or `false`?
// todo: may need to handle that when mapping server values to form initial values, e.g.
// Currently it's working okay
// boolean: accepts 1, 0, 'true', 'false'
// Ex: if (dv.valueType === boolean) { formValue = dv.value ... etc }
// does `isEqual` prop help make 1/true and 0/false/'' equal?
export const BooleanRadios = ({
    name,
    syncData,
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
    const fieldState = form.getFieldState(name)

    const clearButtonProps = convertCallbackSignatures(clearField.input)
    delete clearButtonProps.type

    const handleBlur = () => {
        const { dirty, valid } = fieldState
        const value = fieldState.value || ''
        // If this value has changed, sync it to server if valid
        if (dirty && valid && value !== lastSyncedValue) {
            syncData(value)
        }
    }

    return (
        <div
            className={styles.radioFlexWrapper}
            // Keydown for keyboard nav works nicely on wrapper
            onKeyDown={onKeyDown}
        >
            <Radio
                dense
                label={i18n.t('Yes')}
                value={'true'}
                {...convertCallbackSignatures(yesField.input)}
                onBlur={(_, e) => {
                    handleBlur()
                    yesField.input.onBlur(e)
                }}
            />
            <Radio
                dense
                label={i18n.t('No')}
                value={'false'}
                {...convertCallbackSignatures(noField.input)}
                onBlur={(_, e) => {
                    handleBlur()
                    noField.input.onBlur(e)
                }}
            />
            {fieldState?.value && (
                <Button
                    small
                    secondary
                    className={styles.whiteButton}
                    // callback signatures are transformed above
                    {...clearButtonProps}
                    // on click, set field value to '', sync, and blur
                    onClick={() => {
                        clearField.input.onChange('')
                        syncData('')
                        clearField.input.onBlur()
                    }}
                    // probably not used, but included as back-up to onClick:
                    onBlur={() => {
                        handleBlur()
                        clearField.input.onBlur()
                    }}
                >
                    {i18n.t('Clear')}
                </Button>
            )}
        </div>
    )
}
BooleanRadios.propTypes = InputPropTypes

export const OptionSet = ({
    name,
    syncData,
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
    // todo: onBlur handler doesn't work, meaning the cell stays active
    return (
        <div onKeyDown={onKeyDown} className={styles.selectFlexWrapper}>
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
                    secondary
                    className={styles.whiteButton}
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
    ...InputPropTypes,
    dataElement: PropTypes.shape({
        optionSet: PropTypes.shape({ id: PropTypes.string }),
        valueType: PropTypes.string,
    }).isRequired,
}
