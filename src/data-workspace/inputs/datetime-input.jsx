import { useConfig } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import { Button, CalendarInput } from '@dhis2/ui'
import React, { useEffect, useState } from 'react'
import {
    convertFromIso8601ToString,
    convertToIso8601ToString,
    useSetDataValueMutation,
    useUserInfo,
} from '../../shared/index.js'
import styles from './inputs.module.css'
import { InputPropTypes } from './utils.js'

const convertToDateWithTime = ({ date, time }) =>
    `${date}${time === '' ? '' : 'T' + time}`

export const DateTimeInput = ({
    cocId,
    deId,
    disabled,
    fieldname,
    locked,
    onFocus,
    onBlur,
    onKeyDown,
    initialValue,
    setValueSynced,
}) => {
    const { data: userInfo } = useUserInfo()
    const keyUiLocale = userInfo?.settings?.keyUiLocale

    const { systemInfo = {} } = useConfig()
    const { calendar = 'gregory' } = systemInfo

    const [lastSyncedValue, setLastSyncedValue] = useState(initialValue)
    const [date, setDate] = useState(() => initialValue?.substring(0, 10) ?? '')
    const [time, setTime] = useState(
        () => initialValue?.substring(11, 23) ?? ''
    )
    const [syncTouched, setSyncTouched] = useState(false)

    useEffect(() => {
        if (syncTouched) {
            const dateWithTime = convertToDateWithTime({ date, time })
            setValueSynced(dateWithTime === lastSyncedValue)
        }
    }, [date, time, lastSyncedValue, syncTouched, setValueSynced])

    const { mutate } = useSetDataValueMutation({ deId, cocId })

    const syncData = (dateWithTime) => {
        setSyncTouched(true)
        mutate(
            // Empty values need an empty string
            { value: dateWithTime ?? '' },
            {
                onSuccess: () => {
                    setLastSyncedValue(dateWithTime)
                    onBlur()
                },
            }
        )
    }

    const handleChange = ({ date, time }) => {
        const dateWithTime = convertToDateWithTime({ date, time })

        if (date === '' || time === '') {
            return
        }

        // If this value has changed, sync it to server if valid
        if (dateWithTime !== lastSyncedValue) {
            syncData(dateWithTime)
        }
    }

    const clearValue = () => {
        setDate('')
        setTime('')

        // If this value has changed, sync it to server if valid
        if ('' !== lastSyncedValue) {
            syncData('')
        }
    }

    return (
        <div
            className={styles.dateTimeInput}
            onClick={() => {
                onFocus()
            }}
        >
            <div className={styles.dateTimeInput}>
                <CalendarInput
                    label={i18n.t('Pick a date')}
                    className={styles.dateInput}
                    autoComplete="off"
                    onKeyDown={onKeyDown}
                    disabled={disabled}
                    readOnly={locked}
                    date={
                        date === ''
                            ? ''
                            : convertFromIso8601ToString(date, calendar)
                    }
                    calendar={calendar}
                    onDateSelect={(date) => {
                        const selectedDate = date?.calendarDateString
                            ? convertToIso8601ToString(
                                  date?.calendarDateString,
                                  calendar
                              )
                            : ''
                        setDate(selectedDate)
                        handleChange({ date: selectedDate, time })
                    }}
                    locale={keyUiLocale}
                />
            </div>
            <div className={styles.dateTimeInput}>
                <label
                    htmlFor={`${fieldname}-time`}
                    className={styles.timeLabel}
                >
                    {i18n.t('Pick a time')}
                </label>
                <input
                    id={`${fieldname}-time`}
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
            <div className={styles.dateTimeInput}>
                <Button small onClick={clearValue}>
                    {i18n.t('Clear')}
                </Button>
            </div>
        </div>
    )
}

DateTimeInput.propTypes = InputPropTypes
