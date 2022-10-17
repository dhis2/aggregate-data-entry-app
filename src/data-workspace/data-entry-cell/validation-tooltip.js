import { Tooltip } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import styles from './data-entry-cell.module.css'

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
        // onMouseOut, onMouseOver are not stable references
        // when included, useEffect refires and causes tooltip to flicker
        // TODO add onMouseOut, onMouseOver once https://dhis2.atlassian.net/browse/LIBS-359 is fixed
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [invalid, active])

    // Only open the tooltip if the cell is invalid
    const handleMouseOver = () => {
        if (invalid) {
            open()
        }
    }
    // Close on mouseout if invalid cell is not active
    const handleMouseOut = () => {
        if (invalid && !active) {
            close()
        }
    }

    return (
        <div
            className={styles.validationTooltip}
            ref={ref}
            onMouseOver={handleMouseOver}
            onMouseOut={handleMouseOut}
        >
            {children}
        </div>
    )
})
TooltipManager.propTypes = {
    active: PropTypes.bool,
    children: PropTypes.node,
    invalid: PropTypes.bool,
    onMouseOut: PropTypes.func,
    onMouseOver: PropTypes.func,
}

export const ValidationTooltip = ({ children, content, invalid, active }) => {
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
    children: PropTypes.node,
    content: PropTypes.string,
    fieldname: PropTypes.string,
    invalid: PropTypes.bool,
}
