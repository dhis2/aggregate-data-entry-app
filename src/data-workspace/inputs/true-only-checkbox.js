import { Checkbox } from '@dhis2/ui'
import React, { useState } from 'react'
import { useField } from 'react-final-form'
import { useSetDataValueMutation } from '../../shared/index.js'
import styles from './inputs.module.css'
import { convertCallbackSignatures, InputPropTypes } from './utils.js'

export const TrueOnlyCheckbox = ({
    fieldname,
    deId,
    cocId,
    setSyncStatus,
    onKeyDown,
    onFocus,
    disabled,
    locked,
}) => {
    const { input, meta } = useField(fieldname, {
        type: 'checkbox',
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

    // todo: checking then unchecking the box will send a single unnecessary POST
    const handleBlur = () => {
        // For 'True only', can only send 'true' (or '1') or ''
        const value = input.checked ? 'true' : ''
        const { valid } = meta
        if (valid && value !== lastSyncedValue) {
            syncData(value)
        }
    }

    return (
        <div className={styles.checkboxWrapper} onClick={onFocus}>
            <Checkbox
                dense
                {...convertCallbackSignatures(input)}
                onFocus={(...args) => {
                    input.onFocus(...args)
                    onFocus?.(...args)
                }}
                onBlur={(e) => {
                    handleBlur()
                    input.onBlur(e)
                }}
                onKeyDown={onKeyDown}
                disabled={disabled || locked}
            />
        </div>
    )
}

TrueOnlyCheckbox.propTypes = InputPropTypes
