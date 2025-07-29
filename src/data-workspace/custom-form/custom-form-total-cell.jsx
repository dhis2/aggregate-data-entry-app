import PropTypes from 'prop-types'
import React, { useState, useEffect } from 'react'
import { useValueStore } from '../../shared/index.js'
import { TotalCell } from '../category-combo-table-body/total-cells.jsx'

const computeTotalValues = (dataElementValues) => {
    // Initialise sum as null and only start counting when numerical values
    // are encountered to avoid rendering zeros when the sum isn't actually zero
    return Object.values(dataElementValues).reduce((sum, valueDetails) => {
        const value = valueDetails?.value

        if (!isNaN(value)) {
            sum = isNaN(sum) ? value : sum + Number(value)
        }
        return sum
    }, null)
}

export const CustomFormTotalCell = ({ dataElementId }) => {
    const dataValues = useValueStore((state) => state.getDataValues())
    const dataElementValues = dataValues?.[dataElementId] || {}

    const [total, setTotal] = useState(() =>
        computeTotalValues(dataElementValues)
    )

    useEffect(() => {
        setTotal(() => {
            return computeTotalValues(dataElementValues)
        })
    }, [dataElementValues])
    return <TotalCell>{total}</TotalCell>
}
CustomFormTotalCell.propTypes = {
    dataElementId: PropTypes.string.isRequired,
}

export const replaceTotalCell = (dataElementId) => (
    <CustomFormTotalCell dataElementId={dataElementId} />
)
