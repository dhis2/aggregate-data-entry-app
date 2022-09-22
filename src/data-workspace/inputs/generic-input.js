import cx from 'classnames'
import PropTypes from 'prop-types'
import React, { useState } from 'react'
import { useField } from 'react-final-form'
import {
    NUMBER_TYPES,
    VALUE_TYPES,
    useSetDataValueMutation,
} from '../../shared/index.js'
import { useMinMaxLimits } from '../use-min-max-limits.js'
import styles from './inputs.module.css'
import { InputPropTypes } from './utils.js'
import { validateByValueTypeWithLimits } from './validators.js'

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
    locked,
}) => {
    const limits = useMinMaxLimits(deId, cocId)
    const formatValue = (value) => {
        if (value === undefined) {
            return undefined
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
        validate: validateByValueTypeWithLimits(valueType, limits),
        subscription: { value: true, dirty: true, valid: true },
        format: formatValue,
        formatOnBlur: true,
        // This is require to ensure form is validated on first page load
        // this is because the validate prop doesn't rerender when limits change
        data: limits,
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

    const handleBlur = () => {
        const { value } = input
        const formattedValue = formatValue(value)
        const { valid } = meta
        if (valid && formattedValue !== lastSyncedValue) {
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
            readOnly={locked}
        />
    )
}

GenericInput.propTypes = {
    ...InputPropTypes,
    inputType: PropTypes.string,
}
