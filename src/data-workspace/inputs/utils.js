import PropTypes from 'prop-types'
import React from 'react'

/**
 * Adapt UI components to Final Form's callbacks
 */
export const convertCallbackSignatures = (props) => ({
    ...props,
    onChange: (_, e) => props.onChange(e),
    onFocus: (_, e) => props.onFocus(e),
    onBlur: (_, e) => props.onBlur(e),
})

export const InputPropTypes = {
    name: PropTypes.string.isRequired,
    syncData: PropTypes.func.isRequired,
    lastSyncedValue: PropTypes.any,
}

export const withAdditionalProps = (Component, addlProps) => {
    return function InputWithAddlProps(props) {
        return <Component {...props} {...addlProps} />
    }
}
