import React from 'react'
import { useField } from 'react-final-form'
import { useSetDataValueMutation } from '../../shared/index.js'
import styles from './inputs.module.css'
import { InputPropTypes } from './utils.js'

export const LongText = ({
    fieldname,
    form,
    deId,
    cocId,
    onKeyDown,
    onFocus,
    disabled,
    locked,
}) => {
    const {
        input,
        meta: { valid, data },
    } = useField(fieldname, {
        subscription: { value: true, dirty: true, valid: true, data: true },
    })

    const { mutate } = useSetDataValueMutation({ deId, cocId })
    const syncData = (value) => {
        // todo: Here's where an error state could be set: ('onError')
        mutate(
            // Empty values need an empty string
            { value: value || '' },
            {
                onSuccess: () => {
                    form.mutators.setFieldData(fieldname, {
                        lastSyncedValue: value,
                    })
                },
            }
        )
    }

    const handleBlur = () => {
        const { value } = input
        if (valid && value !== data.lastSyncedValue) {
            syncData(value)
        }
    }

    return (
        <textarea
            className={styles.longText}
            rows="4"
            {...input}
            onFocus={(...args) => {
                input.onFocus(...args)
                onFocus?.(...args)
            }}
            onBlur={(e) => {
                handleBlur()
                input.onBlur(e)
            }}
            onKeyDown={onKeyDown}
            disabled={disabled}
            readOnly={locked}
            autoComplete="off"
        />
    )
}

LongText.propTypes = InputPropTypes
