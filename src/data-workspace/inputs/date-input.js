import { CalendarInput } from '@dhis2/ui'
import cx from 'classnames'
import React from 'react'
import { useField } from 'react-final-form'
import { useSetDataValueMutation, useUserInfo } from '../../shared/index.js'
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
    const {
        data: {
            settings: { keyUiLocale },
        },
    } = useUserInfo()

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
                },
            }
        )
    }

    const handleBlur = () => {
        const { value } = input
        if (meta.valid && value !== meta.data.lastSyncedValue) {
            syncData(value)
        }
    }

    return (
        <CalendarInput
            {...input}
            className={cx(styles.dateInput)}
            onFocus={(...args) => {
                input.onFocus(...args)
                onFocus?.(...args)
            }}
            onBlur={(e) => {
                handleBlur()
                input.onBlur(e)
            }}
            autoComplete="off"
            onKeyDown={onKeyDown}
            disabled={disabled}
            readOnly={locked}
            date={input.value}
            calendar={'gregory'}
            onDateSelect={(date) => {
                input.onChange(date?.calendarDateString)
            }}
            locale={keyUiLocale}
            clearable
        />
    )
}

DateInput.propTypes = InputPropTypes
