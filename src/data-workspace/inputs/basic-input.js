import PropTypes from 'prop-types'
import React from 'react'
import { useField } from 'react-final-form'
import styles from './inputs.module.css'

export const withAdditionalProps = (Component, addlProps) => {
    return function InputWithAddlProps(props) {
        return <Component {...props} {...addlProps} />
    }
}

export const BasicInput = ({
    fieldname,
    syncData,
    lastSyncedValue,
    inputType,
}) => {
    const { input, meta } = useField(fieldname, {
        // input type gets added to native `input` attributes:
        type: inputType,
        subscription: { value: true, dirty: true, valid: true },
    })

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
export const InputPropTypes = {
    fieldname: PropTypes.string.isRequired,
    syncData: PropTypes.func.isRequired,
    lastSyncedValue: PropTypes.any,
    onKeyDown: PropTypes.func,
}
BasicInput.propTypes = {
    ...InputPropTypes,
    inputType: PropTypes.string,
}
