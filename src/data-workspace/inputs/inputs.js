import i18n from '@dhis2/d2-i18n'
import {
    Button,
    Radio,
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
import { convertCallbackSignatures } from './utils.js'

export const withAdditionalProps = (Component, addlProps) => {
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
export const InputPropTypes = {
    name: PropTypes.string.isRequired,
    syncData: PropTypes.func.isRequired,
    lastSyncedValue: PropTypes.any,
    onKeyDown: PropTypes.func,
}
BasicInput.propTypes = {
    ...InputPropTypes,
    inputType: PropTypes.string,
}

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
            <Button
                small
                secondary
                className={cx(styles.whiteButton, {
                    // If no value to clear, hide but still reserve space
                    [styles.hidden]: !fieldState?.value,
                })}
                // Callback signatures are transformed above
                {...clearButtonProps}
                // On click, set field value to '', sync, and blur
                onClick={() => {
                    clearField.input.onChange('')
                    syncData('')
                    clearField.input.onBlur()
                }}
                onBlur={() => {
                    handleBlur() // Probably handled by onClick, but included here for safety
                    clearField.input.onBlur()
                }}
            >
                {i18n.t('Clear')}
            </Button>
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
    const { data: metadata } = useMetadata()

    const handleChange = (value) => {
        // For a select using onChange, don't need to check valid or dirty, respectively
        if (value !== lastSyncedValue) {
            syncData(value)
        }
    }

    const optionSet = getOptionSetById(metadata, dataElement.optionSet.id)
    // filter out 'null' options
    const options = optionSet.options.filter((opt) => !!opt)

    // todo: onBlur handler doesn't work, meaning the cell stays active.
    // may need to build from scratch
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
                        input.onBlur()
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
