import { useConfig } from '@dhis2/app-runtime'
import { CalendarInput } from '@dhis2/ui'
import React from 'react'
import { useField } from 'react-final-form'
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
    fieldname,
    form,
    locked,
    onFocus,
    onKeyDown,
}) => {
    const { data: userInfo } = useUserInfo()
    const keyUiLocale = userInfo?.settings?.keyUiLocale

    const { systemInfo } = useConfig()
    const { calendar } = systemInfo

    const { input, meta } = useField(fieldname, {
        subscription: {
            value: true,
            dirty: true,
            valid: true,
            data: true,
        },
    })

    const { mutate } = useSetDataValueMutation({ deId, cocId })

    const syncData = (value) => {
        mutate(
            // Empty values need an empty string
            { value: value || '' },
            {
                onSuccess: () => {
                    form.mutators.setFieldData(fieldname, {
                        lastSyncedValue: value,
                    })
                    input.onBlur()
                },
            }
        )
    }

    const handleChange = (value) => {
        // If this value has changed, sync it to server if valid
        if (meta.valid && value !== meta.data.lastSyncedValue) {
            syncData(value)
        }
    }

    return (
        <div
            onClick={() => {
                onFocus()
                input.onFocus()
            }}
            className={styles.dateInputContainer}
        >
            <CalendarInput
                {...input}
                className={styles.dateInput}
                autoComplete="off"
                onKeyDown={onKeyDown}
                disabled={disabled}
                readOnly={locked}
                date={
                    input?.value
                        ? convertFromIso8601ToString(input.value, calendar)
                        : ''
                }
                calendar={calendar}
                onDateSelect={(date) => {
                    const selectedDate = date?.calendarDateString
                        ? convertToIso8601ToString(
                              date?.calendarDateString,
                              calendar
                          )
                        : ''
                    input.onChange(selectedDate)
                    handleChange(selectedDate)
                }}
                locale={keyUiLocale}
                clearable
            />
        </div>
    )
}

DateInput.propTypes = InputPropTypes
