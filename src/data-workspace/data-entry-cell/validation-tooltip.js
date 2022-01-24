import { Tooltip } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'

/**
 * These components adapt the UI Tooltip component to be used for the
 * validation feedback tooltip in DE cells, which has a few needs:
 * 1. Should only open when the cell is invalid
 * 2. Should gracefully close when the cell becomes valid again
 * 3. Should not cause cell to lose focus when it becomes invalid
 */

const TooltipManager = React.forwardRef(function TooltipManager(
    { children, invalid, onMouseOut, onMouseOver },
    ref
) {
    React.useEffect(() => {
        // When this cell becomes valid, close the tooltip
        if (!invalid) {
            onMouseOut()
        }
    }, [invalid])

    // Only open the tooltip if the cell is invalid
    const handleMouseOver = () => {
        if (invalid) {
            onMouseOver()
        }
    }
    const handleMouseOut = () => {
        if (invalid) {
            onMouseOut()
        }
    }

    return children({
        onMouseOver: handleMouseOver,
        onMouseOut: handleMouseOut,
        ref,
    })
})
TooltipManager.propTypes = {
    children: PropTypes.func,
    invalid: PropTypes.bool,
    onMouseOut: PropTypes.func,
    onMouseOver: PropTypes.func,
}

export const ValidationTooltip = ({ invalid, error, children }) => {
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
                <TooltipManager {...props} invalid={invalid}>
                    {children}
                </TooltipManager>
            )}
        </Tooltip>
    )
}
ValidationTooltip.propTypes = {
    children: PropTypes.func,
    error: PropTypes.string,
    invalid: PropTypes.bool,
}
