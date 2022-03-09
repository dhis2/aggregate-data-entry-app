import { Checkbox } from '@dhis2/ui'
import React from 'react'
import { useField } from 'react-final-form'
import styles from './inputs.module.css'
import { convertCallbackSignatures, InputPropTypes } from './utils.js'

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
