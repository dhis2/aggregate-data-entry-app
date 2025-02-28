import cx from 'classnames'
import PropTypes from 'prop-types'
import React, { useEffect, useState } from 'react'
import {
    NUMBER_TYPES,
    VALUE_TYPES,
    useEntryFormStore,
    useSetDataValueMutation,
} from '../../shared/index.js'
import { useMinMaxLimits } from '../use-min-max-limits.js'
import styles from './inputs.module.css'
import { InputPropTypes } from './utils.js'
import {
    validateByValueType,
    warningValidateByValueType,
} from './validators.js'

const htmlTypeAttrsByValueType = {
    [VALUE_TYPES.DATETIME]: 'datetime-local',
    [VALUE_TYPES.EMAIL]: 'email',
    [VALUE_TYPES.PHONE_NUMBER]: 'tel',
    [VALUE_TYPES.TIME]: 'time',
    [VALUE_TYPES.URL]: 'url',
}

const formatValue = ({ value, valueType }) => {
    if (value === undefined) {
        return undefined
    }
    const trimmedValue = value.trim()
    if (trimmedValue === '') {
        return ''
    }
    if (
        trimmedValue &&
        NUMBER_TYPES.includes(valueType) &&
        Number.isFinite(Number(value))
    ) {
        return Number(value).toString()
    } else {
        return trimmedValue
    }
}

export const GenericInput = ({
    fieldname,
    deId,
    cocId,
    valueType,
    onKeyDown,
    onFocus,
    onBlur,
    disabled,
    locked,
    setValueSynced,
    initialValue,
}) => {
    const [value, setValue] = useState(initialValue)
    const [lastSyncedValue, setLastSyncedValue] = useState(initialValue)
    const [syncTouched, setSyncTouched] = useState(false)

    useEffect(() => {
        if (syncTouched) {
            setValueSynced(value === lastSyncedValue)
        }
    }, [value, lastSyncedValue, syncTouched, setValueSynced])

    const limits = useMinMaxLimits(deId, cocId)

    const setWarning = useEntryFormStore((state) => state.setWarning)
    const setError = useEntryFormStore((state) => state.setError)

    const validatorForValueType = validateByValueType(valueType, limits)
    const warningValidator = warningValidateByValueType(valueType, limits)

    // check if the initial value has any associated warnings
    useEffect(() => {
        // only check if the value has not been updated (i.e. is initial value)
        if (!syncTouched) {
            const warningValidationResult = warningValidator(value)
            setWarning(fieldname, warningValidationResult)
        }
    }, [value, syncTouched, warningValidator, setWarning, fieldname])

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

    const handleBlur = (value) => {
        const formattedValue = formatValue({ value, valueType })

        const invalid = validatorForValueType(value)
        setError(fieldname, invalid)

        const warningValidationResult = warningValidator(value)
        setWarning(fieldname, warningValidationResult)

        if (formattedValue !== lastSyncedValue && !invalid) {
            syncData(formattedValue)
        }
    }

    return (
        <input
            value={value ?? ''}
            className={cx(styles.basicInput, {
                [styles.alignToEnd]: NUMBER_TYPES.includes(valueType),
            })}
            type={htmlTypeAttrsByValueType[valueType]}
            onFocus={(...args) => {
                onFocus?.(...args)
            }}
            onBlur={() => {
                onBlur()
                handleBlur(value)
            }}
            onChange={(e) => {
                setValue(e.target.value)
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
    valueType: PropTypes.string,
}
