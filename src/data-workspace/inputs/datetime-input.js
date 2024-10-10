import { useConfig } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import { Button, CalendarInput } from '@dhis2/ui'
import React, { useState } from 'react'
import { useField } from 'react-final-form'
import { useSetDataValueMutation, useUserInfo } from '../../shared/index.js'
import styles from './inputs.module.css'
import { InputPropTypes } from './utils.js'

export const DateTimeInput = ({
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

    const { systemInfo = {} } = useConfig()
    const { calendar = 'gregory' } = systemInfo

    const { input, meta } = useField(fieldname, {
        subscription: {
            value: true,
            dirty: true,
            valid: true,
            data: true,
        },
    })

    const [date, setDate] = useState(input?.value?.substring(0, 10) ?? '')
    const [time, setTime] = useState(input?.value?.substring(11, 23) ?? '')

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

    const handleChange = ({ date, time }) => {
        const dateWithTime = `${date}${time === '' ? '' : 'T' + time}`
        input.onChange(dateWithTime)

        if (date === '' || time === '') {
            return
        }

        // If this value has changed, sync it to server if valid
        if (meta.valid && dateWithTime !== meta.data.lastSyncedValue) {
            syncData(dateWithTime)
        }
    }

    const clearValue = () => {
        setDate('')
        setTime('')
        input.onChange('')

        // If this value has changed, sync it to server if valid
        if (meta.valid && '' !== meta.data.lastSyncedValue) {
            syncData('')
        }
    }

    return (
        <div
            className={styles.dateTimeInput}
            onClick={() => {
                onFocus()
                input.onFocus()
            }}
        >
            <div>
                <CalendarInput
                    {...input}
                    label={i18n.t('Pick a date and time')}
                    className={styles.dateInput}
                    autoComplete="off"
                    onKeyDown={onKeyDown}
                    disabled={disabled}
                    readOnly={locked}
                    date={date}
                    calendar={calendar}
                    onDateSelect={(date) => {
                        const selectedDate = date?.calendarDateString ?? ''
                        setDate(selectedDate)
                        handleChange({ date: selectedDate, time })
                    }}
                    locale={keyUiLocale}
                />
            </div>
            <div>
                <input
                    readOnly={locked}
                    type="time"
                    value={time}
                    onChange={(e) => {
                        const selectedTime = e?.target?.value ?? ''
                        setTime(selectedTime)
                        handleChange({ date, time: selectedTime })
                    }}
                    data-test="time-input"
                />
            </div>
            <div>
                <Button small onClick={clearValue}>
                    {i18n.t('Clear')}
                </Button>
            </div>
        </div>
    )
}

DateTimeInput.propTypes = InputPropTypes
