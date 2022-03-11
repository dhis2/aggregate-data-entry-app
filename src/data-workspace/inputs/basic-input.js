import {
    email,
    integer,
    internationalPhoneNumber,
    number,
    url,
} from '@dhis2/ui-forms'
import PropTypes from 'prop-types'
import React, { useState } from 'react'
import { useField } from 'react-final-form'
import { useDataValueMutation } from '../data-entry-cell/use-data-value-mutation.js'
import { VALUE_TYPES } from '../data-entry-cell/value-types.js'
import styles from './inputs.module.css'
import { InputPropTypes } from './utils.js'
import {
    // date,
    // dateTime,
    integerPositive,
    integerZeroOrPositive,
    integerNegative,
    letter,
    percentage,
    time,
    text,
    unitInterval,
} from './validators.js'

const validatorsByValueType = {
    [VALUE_TYPES.DATE]: null, // todo (in case browser doesn't support special input)
    [VALUE_TYPES.DATETIME]: null, // todo " "
    [VALUE_TYPES.EMAIL]: email,
    [VALUE_TYPES.INTEGER]: integer,
    [VALUE_TYPES.INTEGER_POSITIVE]: integerPositive,
    [VALUE_TYPES.INTEGER_NEGATIVE]: integerNegative,
    [VALUE_TYPES.INTEGER_ZERO_OR_POSITIVE]: integerZeroOrPositive,
    [VALUE_TYPES.LETTER]: letter,
    [VALUE_TYPES.NUMBER]: number,
    [VALUE_TYPES.PERCENTAGE]: percentage,
    [VALUE_TYPES.PHONE_NUMBER]: internationalPhoneNumber,
    [VALUE_TYPES.TEXT]: text,
    [VALUE_TYPES.TIME]: time,
    [VALUE_TYPES.UNIT_INTERVAL]: unitInterval,
    [VALUE_TYPES.URL]: url,
}

const htmlTypeAttrsByValueType = {
    [VALUE_TYPES.DATE]: 'date',
    [VALUE_TYPES.DATETIME]: 'datetime-local',
    [VALUE_TYPES.EMAIL]: 'email',
    [VALUE_TYPES.PHONE_NUMBER]: 'tel',
    [VALUE_TYPES.TIME]: 'time',
    [VALUE_TYPES.URL]: 'url',
}

export const BasicInput = ({
    fieldname,
    dataValueParams,
    setSyncStatus,
    valueType,
}) => {
    const { input, meta } = useField(fieldname, {
        validate: validatorsByValueType[valueType],
        subscription: { value: true, dirty: true, valid: true },
    })
    const [lastSyncedValue, setLastSyncedValue] = useState()
    const { mutate } = useDataValueMutation()
    const syncData = (value) => {
        // todo: Here's where an error state could be set: ('onError')
        mutate(
            // Empty values need an empty string
            { ...dataValueParams, value: value || '' },
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
        const { dirty, valid } = meta
        if (dirty && valid && value !== lastSyncedValue) {
            syncData(value)
        }
    }

    return (
        <input
            {...input}
            className={styles.basicInput}
            type={htmlTypeAttrsByValueType[valueType]}
            onBlur={(e) => {
                handleBlur()
                input.onBlur(e)
            }}
        />
    )
}
BasicInput.propTypes = {
    ...InputPropTypes,
    inputType: PropTypes.string,
}
