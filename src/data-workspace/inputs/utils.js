import PropTypes from 'prop-types'

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
    cocId: PropTypes.string,
    deId: PropTypes.string,
    disabled: PropTypes.bool,
    locked: PropTypes.bool,
    lastSyncedValue: PropTypes.any,
    setSyncStatus: PropTypes.func,
}
