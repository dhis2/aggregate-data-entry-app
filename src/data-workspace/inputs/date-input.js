import { useConfig } from '@dhis2/app-runtime'
import { CalendarInput } from '@dhis2/ui'
import React, { useState, useEffect } from 'react'
import {
    useSetDataValueMutation,
    useUserInfo,
    convertFromIso8601ToString,
    convertToIso8601ToString,
} from '../../shared/index.js'
import styles from './inputs.module.css'
import { InputPropTypes } from './utils.js'

export const DateInput = ({
    cocId,
    deId,
    disabled,
    locked,
    onFocus,
    onBlur,
    onKeyDown,
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
    }, [value, lastSyncedValue, syncTouched])

    const { data: userInfo } = useUserInfo()
    const keyUiLocale = userInfo?.settings?.keyUiLocale

    const { systemInfo } = useConfig()
    const { calendar } = systemInfo

    const { mutate } = useSetDataValueMutation({ deId, cocId })

    const syncData = (newValue) => {
        setSyncTouched(true)
        mutate(
            // Empty values need an empty string
            { value: newValue || '' },
            {
                onSuccess: () => {
                    setLastSyncedValue(newValue)
                    onBlur()
                },
            }
        )
    }

    const handleChange = (value) => {
        setValue(value)
        // If this value has changed, sync it to server if valid
        if (value !== lastSyncedValue) {
            syncData(value)
        }
    }

    return (
        <div
            onClick={() => {
                onFocus()
            }}
            className={styles.dateInputContainer}
        >
            <CalendarInput
                className={styles.dateInput}
                autoComplete="off"
                onKeyDown={onKeyDown}
                disabled={disabled}
                readOnly={locked}
                date={value ? convertFromIso8601ToString(value, calendar) : ''}
                calendar={calendar}
                onDateSelect={(date) => {
                    const selectedDate = date?.calendarDateString
                        ? convertToIso8601ToString(
                              date?.calendarDateString,
                              calendar
                          )
                        : ''
                    handleChange(selectedDate)
                }}
                locale={keyUiLocale}
                clearable
            />
        </div>
    )
}

DateInput.propTypes = InputPropTypes
