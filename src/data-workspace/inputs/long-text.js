import React, { useState } from 'react'
import { useField } from 'react-final-form'
import { useSetDataValueMutation } from '../use-data-value-mutation/index.js'
import styles from './inputs.module.css'
import { InputPropTypes } from './utils.js'

export const LongText = ({
    fieldname,
    dataValueParams,
    setSyncStatus,
    disabled,
    locked,
}) => {
    const { input, meta } = useField(fieldname, {
        subscription: { value: true, dirty: true, valid: true },
    })

    const [lastSyncedValue, setLastSyncedValue] = useState()
    const { mutate } = useSetDataValueMutation()
    const syncData = (value) => {
        // todo: Here's where an error state could be set: ('onError')
        mutate(
            // Empty values need an empty string
            { ...dataValueParams, value: value || '' },
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
            disabled={disabled}
            readOnly={locked}
            autoComplete="off"
        />
    )
}

LongText.propTypes = InputPropTypes
