import { Tooltip } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'

/**
 * These components adapt the UI Tooltip component to be used for the
 * validation feedback tooltip in DE cells, which has a few needs:
 * 1. Should only open when the cell state is invalid
 * 2. Should gracefully close when the cell becomes valid again
 * 3. Should not cause cell to lose focus when it becomes invalid
 * 4. Should open when focused and close when defocused
 */

const TooltipManager = React.forwardRef(function TooltipManager(
    { active, children, invalid, onMouseOut: close, onMouseOver: open },
    ref
) {
    React.useEffect(() => {
        if (invalid && active) {
            open()
        }
        // When this cell becomes valid or defocused, close the tooltip
        else {
            close()
        }
    }, [invalid, active])

    // Only open the tooltip if the cell is invalid
    const onMouseOver = () => {
        if (invalid) {
            open()
        }
    }
    // Close on mouseout if invalid cell is not active
    const onMouseOut = () => {
        if (invalid && !active) {
            close()
        }
    }

    return children({
        onMouseOver,
        onMouseOut,
        ref,
    })
})
TooltipManager.propTypes = {
    active: PropTypes.bool,
    children: PropTypes.func,
    invalid: PropTypes.bool,
    onMouseOut: PropTypes.func,
    onMouseOver: PropTypes.func,
}

export const ValidationTooltip = ({ active, children, error, invalid }) => {
    const [content, setContent] = React.useState(error)

    // Keep tooltip content even when `error` is undefined so tooltip still has
    // content when closing after cell becomes valid again
    React.useEffect(() => {
        if (error) {
            setContent(error)
        }
    }, [error])

    return (
        <Tooltip content={content}>
            {(props) => (
                <TooltipManager {...props} invalid={invalid} active={active}>
                    {children}
                </TooltipManager>
            )}
        </Tooltip>
    )
}
ValidationTooltip.propTypes = {
    active: PropTypes.bool,
    children: PropTypes.func,
    error: PropTypes.string,
    invalid: PropTypes.bool,
}
