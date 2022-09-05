import cx from 'classnames'
import PropTypes from 'prop-types'
import React, { useState, useEffect } from 'react'
import { useField } from 'react-final-form'
import { NUMBER_TYPES, VALUE_TYPES } from '../../shared/index.js'
import { useSetDataValueMutation } from '../data-value-mutations/index.js'
import styles from './inputs.module.css'
import { InputPropTypes } from './utils.js'
import { validatorsByValueType } from './validators.js'

const htmlTypeAttrsByValueType = {
    [VALUE_TYPES.DATE]: 'date',
    [VALUE_TYPES.DATETIME]: 'datetime-local',
    [VALUE_TYPES.EMAIL]: 'email',
    [VALUE_TYPES.PHONE_NUMBER]: 'tel',
    [VALUE_TYPES.TIME]: 'time',
    [VALUE_TYPES.URL]: 'url',
}

export const GenericInput = ({
    fieldname,
    deId,
    cocId,
    setSyncStatus,
    valueType,
    onKeyDown,
    onFocus,
    disabled,
}) => {
    const [lastSyncedValue, setLastSyncedValue] = useState('')
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

    const formatValue = (value) => {
        if (value === undefined) {
            return ''
        } else if (
            value.trim() &&
            NUMBER_TYPES.includes(valueType) &&
            Number.isFinite(Number(value))
        ) {
            return Number(value).toString()
        } else {
            return value.trim()
        }
    }

    const { input, meta } = useField(fieldname, {
        validate: validatorsByValueType[valueType],
        subscription: { value: true, dirty: true, valid: true },
        format: formatValue,
        formatOnBlur: true,
    })

    // need to initialize lastSyncedValue
    useEffect(() => {
        if (input.value !== undefined) {
            setLastSyncedValue(input.value)
        }
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    const handleBlur = () => {
        const { value } = input
        const formattedValue = formatValue(value)
        const { dirty, valid } = meta
        if (dirty && valid && formattedValue !== lastSyncedValue) {
            syncData(formattedValue)
        }
    }

    return (
        <input
            {...input}
            value={input.value ?? ''}
            className={cx(styles.basicInput, {
                [styles.alignToEnd]: NUMBER_TYPES.includes(valueType),
            })}
            type={htmlTypeAttrsByValueType[valueType]}
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
        />
    )
}

GenericInput.propTypes = {
    ...InputPropTypes,
    inputType: PropTypes.string,
}
