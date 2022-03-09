import i18n from '@dhis2/d2-i18n'
import { Button, Radio } from '@dhis2/ui'
import cx from 'classnames'
import React from 'react'
import { useField, useForm } from 'react-final-form'
import styles from './inputs.module.css'
import { convertCallbackSignatures, InputPropTypes } from './utils.js'

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
