import { Tooltip } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'

export default function DisabledTooltip({ tooltipContent, children }) {
    if (!tooltipContent) {
        return children
    }

    return (
        <Tooltip content={tooltipContent}>
            {({ ref, onMouseOver, onMouseOut }) => (
                <div
                    ref={ref}
                    onMouseOver={onMouseOver}
                    onMouseOut={onMouseOut}
                >
                    {children}
                </div>
            )}
        </Tooltip>
    )
}

DisabledTooltip.propTypes = {
    children: PropTypes.any.isRequired,
    tooltipContent: PropTypes.string,
}
