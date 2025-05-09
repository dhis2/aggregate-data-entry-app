import i18n from '@dhis2/d2-i18n'
import { Tooltip } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import { useDataSetId } from '../../shared/index.js'

export default function DisabledTooltip({ children }) {
    const [dataSetId] = useDataSetId()
    const tooltipContent = !dataSetId
        ? i18n.t('Choose a data set first')
        : undefined

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
}
