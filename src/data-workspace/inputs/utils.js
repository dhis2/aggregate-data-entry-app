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

export const convertBooleanValue = (val) => {
    if (['true', '1', true, 1].includes(val)) {
        return 'true'
    }
    if (['false', '0', false, 0].includes(val)) {
        return 'false'
    }
    return ''
}

export const InputPropTypes = {
    form: PropTypes.shape({
        mutators: PropTypes.shape({
            setFieldData: PropTypes.func,
        }),
    }),
    onKeyDown: PropTypes.func.isRequired,
    cocId: PropTypes.string,
    deId: PropTypes.string,
    disabled: PropTypes.bool,
    initialValue: PropTypes.string,
    lastSyncedValue: PropTypes.any,
    locked: PropTypes.bool,
    onBlur: PropTypes.func,
    onFocus: PropTypes.func,
}
