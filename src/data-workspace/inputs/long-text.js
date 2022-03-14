import React, { useState } from 'react'
import { useField } from 'react-final-form'
import { useDataValueMutation } from '../data-entry-cell/use-data-value-mutation.js'
import styles from './inputs.module.css'
import { InputPropTypes } from './utils.js'

export const LongText = ({ fieldname, dataValueParams, setSyncStatus }) => {
    const { input, meta } = useField(fieldname, {
        subscription: { value: true, dirty: true, valid: true },
    })

    const [lastSyncedValue, setLastSyncedValue] = useState()
    const { mutate } = useDataValueMutation()
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
        />
    )
}
LongText.propTypes = InputPropTypes
