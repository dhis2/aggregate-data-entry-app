import React, { useEffect, useState } from 'react'
import { useSetDataValueMutation } from '../../shared/index.js'
import styles from './inputs.module.css'
import { InputPropTypes } from './utils.js'

export const LongText = ({
    deId,
    cocId,
    onKeyDown,
    onFocus,
    onBlur,
    disabled,
    locked,
    initialValue,
    setValueSynced,
}) => {
    const [value, setValue] = useState(initialValue)
    const [lastSyncedValue, setLastSyncedValue] = useState(initialValue)
    const [syncTouched, setSyncTouched] = useState(false)

    useEffect(() => {
        if (syncTouched) {
            setValueSynced(value === lastSyncedValue)
        }
    }, [value, lastSyncedValue, syncTouched, setValueSynced])

    const { mutate } = useSetDataValueMutation({ deId, cocId })
    const syncData = (newValue) => {
        setSyncTouched(true)
        // todo: Here's where an error state could be set: ('onError')
        mutate(
            // Empty values need an empty string
            { value: newValue || '' },
            {
                onSuccess: () => {
                    setLastSyncedValue(newValue)
                },
            }
        )
    }

    const handleBlur = () => {
        if (value !== lastSyncedValue) {
            syncData(value)
        }
    }

    return (
        <textarea
            className={styles.longText}
            rows="4"
            value={value ?? ''}
            onChange={(e) => {
                setValue(e.target.value)
            }}
            onFocus={(...args) => {
                onFocus?.(...args)
            }}
            onBlur={() => {
                onBlur()
                handleBlur()
            }}
            onKeyDown={onKeyDown}
            disabled={disabled}
            readOnly={locked}
            autoComplete="off"
        />
    )
}

LongText.propTypes = InputPropTypes
