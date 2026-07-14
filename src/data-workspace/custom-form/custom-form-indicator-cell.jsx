import PropTypes from 'prop-types'
import React from 'react'
import { IndicatorTableCell } from '../indicators-table-body/indicator-table-cell.jsx'

export const CustomFormIndicatorCell = ({ indicatorId, metadata }) => {
    const {
        denominator,
        numerator,
        indicatorType: { factor },
        decimals,
    } = metadata.indicators[indicatorId]

    return (
        <IndicatorTableCell
            denominator={denominator}
            numerator={numerator}
            factor={factor}
            decimals={decimals}
            indicatorId={indicatorId}
        />
    )
}
CustomFormIndicatorCell.propTypes = {
    indicatorId: PropTypes.string.isRequired,
    metadata: PropTypes.object.isRequired,
}

export const replaceIndicatorCell = (indicatorId, metadata) => (
    <CustomFormIndicatorCell indicatorId={indicatorId} metadata={metadata} />
)
