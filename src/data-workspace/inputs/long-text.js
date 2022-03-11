import React from 'react'
import { useField } from 'react-final-form'
import styles from './inputs.module.css'
import { InputPropTypes } from './utils.js'

export const LongText = ({ name, syncData, lastSyncedValue }) => {
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
        />
    )
}
LongText.propTypes = InputPropTypes
