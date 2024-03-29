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
    form: PropTypes.shape({
        mutators: PropTypes.shape({
            setFieldData: PropTypes.func,
        }),
    }),
    onKeyDown: PropTypes.func.isRequired,
    cocId: PropTypes.string,
    deId: PropTypes.string,
    disabled: PropTypes.bool,
    lastSyncedValue: PropTypes.any,
    locked: PropTypes.bool,
    onFocus: PropTypes.func,
}
