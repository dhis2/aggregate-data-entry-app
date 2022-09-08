import React, { useState } from 'react'
import { useField } from 'react-final-form'
import { useSetDataValueMutation } from '../data-value-mutations/index.js'
import styles from './inputs.module.css'
import { InputPropTypes } from './utils.js'

export const LongText = ({
    fieldname,
    deId,
    cocId,
    setSyncStatus,
    onKeyDown,
    onFocus,
    disabled,
}) => {
    const { input, meta } = useField(fieldname, {
        subscription: { value: true, dirty: true, valid: true },
    })

    const [lastSyncedValue, setLastSyncedValue] = useState(input.value)
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

    const handleBlur = () => {
        const { value } = input
        const { valid } = meta
        if (valid && value !== lastSyncedValue) {
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
            autoComplete="off"
        />
    )
}

LongText.propTypes = InputPropTypes
