import PropTypes from 'prop-types'
import React, { useState } from 'react'
import { useField } from 'react-final-form'
import { useDataValueMutation } from '../data-entry-cell/use-data-value-mutation.js'
import styles from './inputs.module.css'
import { InputPropTypes } from './utils.js'

export const withAdditionalProps = (Component, addlProps) => {
    return function InputWithAddlProps(props) {
        return <Component {...props} {...addlProps} />
    }
}

export const BasicInput = ({
    fieldname,
    inputType,
    dataValueParams,
    setSyncStatus,
}) => {
    const { input, meta } = useField(fieldname, {
        // input type gets added to native `input` attributes:
        type: inputType,
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
            className={styles.basicInput}
            {...input}
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
