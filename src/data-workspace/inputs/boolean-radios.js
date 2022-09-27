import i18n from '@dhis2/d2-i18n'
import { Button, Radio } from '@dhis2/ui'
import cx from 'classnames'
import React, { useState } from 'react'
import { useField } from 'react-final-form'
import { useSetDataValueMutation } from '../../shared/index.js'
import styles from './inputs.module.css'
import { convertCallbackSignatures, InputPropTypes } from './utils.js'

// ? Will this fail to reflect a value on the server if it's not exactly `true` or `false`?
// todo: may need to handle that when mapping server values to form initial values, e.g.
// Currently it's working okay
// boolean: accepts 1, 0, 'true', 'false'
// Ex: if (dv.valueType === boolean) { formValue = dv.value ... etc }
// does `isEqual` prop help make 1/true and 0/false/'' equal?
export const BooleanRadios = ({
    fieldname,
    deId,
    cocId,
    disabled,
    locked,
    setSyncStatus,
    onKeyDown,
    onFocus,
}) => {
    const useFieldWithPatchedOnFocus = (...args) => {
        const { input, ...rest } = useField(...args)
        return {
            ...rest,
            input: {
                ...input,
                onFocus: (...args) => {
                    input.onFocus(...args)
                    onFocus?.(...args)
                },
            },
        }
    }
    const yesField = useFieldWithPatchedOnFocus(fieldname, {
        type: 'radio',
        value: 'true',
        subscription: { value: true },
    })

    const noField = useFieldWithPatchedOnFocus(fieldname, {
        type: 'radio',
        value: 'false',
        subscription: { value: true },
    })

    // Used for the 'clear' button, but works
    const clearField = useFieldWithPatchedOnFocus(fieldname, {
        type: 'radio',
        value: '',
        subscription: { value: true },
    })

    const {
        input: { value: fieldvalue },
        meta,
    } = useField(fieldname)
    const [lastSyncedValue, setLastSyncedValue] = useState(fieldvalue)

    const { mutate } = useSetDataValueMutation({ deId, cocId })
    const syncData = (value) => {
        // todo: Here's where an error state could be set: ('onError')
        mutate(
            // Empty values need an empty string
            { value: value || '' },
            {
                onSuccess: () => {
                    setLastSyncedValue(value)
                    setSyncStatus({ syncing: false, synced: true })
                },
            }
        )
    }

    const clearButtonProps = convertCallbackSignatures(clearField.input)
    delete clearButtonProps.type

    const handleChange = (value) => {
        const { valid } = meta
        // If this value has changed, sync it to server if valid
        if (valid && value !== lastSyncedValue) {
            syncData(value)
        }
    }

    return (
        <div className={styles.radioFlexWrapper} onClick={onFocus}>
            <Radio
                dense
                label={i18n.t('Yes')}
                value={'true'}
                {...convertCallbackSignatures(yesField.input)}
                onChange={(_, e) => {
                    handleChange('true')
                    yesField.input.onChange(e)
                }}
                onKeyDown={onKeyDown}
                disabled={disabled || locked}
            />
            <Radio
                dense
                label={i18n.t('No')}
                value={'false'}
                {...convertCallbackSignatures(noField.input)}
                onChange={(_, e) => {
                    handleChange('false')
                    noField.input.onChange(e)
                }}
                onKeyDown={onKeyDown}
                disabled={disabled || locked}
            />
            <Button
                small
                secondary
                className={cx(styles.whiteButton, {
                    // If no value to clear, hide but still reserve space
                    [styles.hidden]: !fieldvalue,
                })}
                // Callback signatures are transformed above
                {...clearButtonProps}
                // On click, set field value to '', sync, and blur
                onClick={() => {
                    clearField.input.onChange('')
                    syncData('')
                    clearField.input.onBlur()
                }}
                onKeyDown={onKeyDown}
                disabled={disabled || locked}
            >
                {i18n.t('Clear')}
            </Button>
        </div>
    )
}

BooleanRadios.propTypes = InputPropTypes
