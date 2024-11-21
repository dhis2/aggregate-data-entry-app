import { Checkbox } from '@dhis2/ui'
import React, { useState } from 'react'
import { useSetDataValueMutation } from '../../shared/index.js'
import styles from './inputs.module.css'
import { convertBooleanValue, InputPropTypes } from './utils.js'

export const TrueOnlyCheckbox = ({
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
    const [value, setValue] = useState(() => convertBooleanValue(initialValue))
    const [lastSyncedValue, setLastSyncedValue] = useState(() =>
        convertBooleanValue(initialValue)
    )

    const { mutate } = useSetDataValueMutation({ deId, cocId })
    const syncData = (newValue) => {
        // todo: Here's where an error state could be set: ('onError')
        mutate(
            // Empty values need an empty string
            { value: newValue || '' },
            {
                onSuccess: () => {
                    setLastSyncedValue(newValue)
                    setValueSynced(newValue === value)
                },
            }
        )
    }

    // todo: checking then unchecking the box will send a single unnecessary POST
    const handleBlur = () => {
        if (value !== lastSyncedValue) {
            syncData(value)
        }
    }

    return (
        <div className={styles.checkboxWrapper} onClick={onFocus}>
            <Checkbox
                dense
                checked={value === 'true'}
                onFocus={(...args) => {
                    onFocus?.(...args)
                }}
                onChange={(e) => {
                    setValue(e.checked ? 'true' : '')
                }}
                onBlur={() => {
                    handleBlur()
                    onBlur()
                }}
                onKeyDown={onKeyDown}
                disabled={disabled || locked}
            />
        </div>
    )
}

TrueOnlyCheckbox.propTypes = InputPropTypes
