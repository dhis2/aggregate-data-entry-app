import cx from 'classnames'
import PropTypes from 'prop-types'
import React, { useState } from 'react'
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

const formatNumberTypes = [
    VALUE_TYPES.NUMBER,
    VALUE_TYPES.UNIT_INTERVAL,
    VALUE_TYPES.PERCENTAGE,
]

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
    const [lastSyncedValue, setLastSyncedValue] = useState()
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
        let formattedValue = value

        if (
            value &&
            formatNumberTypes.includes(valueType) &&
            Number.isFinite(Number(value))
        ) {
            formattedValue = Number(value).toString()
        }

        return formattedValue
    }

    const { input, meta } = useField(fieldname, {
        validate: validatorsByValueType[valueType],
        subscription: { value: true, dirty: true, valid: true },
        format: formatValue,
        formatOnBlur: true,
    })

    const handleBlur = () => {
        const { value } = input
        const hasEmptySpaces = value && value.trim() === ''
        const { dirty, valid } = meta
        if (dirty && valid && !hasEmptySpaces && value !== lastSyncedValue) {
            syncData(value ? formatValue(value.trim()) : ``)
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
