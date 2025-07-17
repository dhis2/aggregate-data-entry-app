import PropTypes from 'prop-types'
import React, { useState, useEffect } from 'react'
import {
    useBlurredField,
    useValueStore,
    useEntryFormStore,
} from '../../shared/index.js'
import { TotalCell } from '../category-combo-table-body/total-cells.jsx'
import { parseFieldId } from '../get-field-id.jsx'

const computeTotal = (dataElementId, dataValues, formErrors) => {
    const dataElementValues = dataValues?.[dataElementId] || {}

    if (!dataElementValues) {
        return null
    }

    // Initialise sum as null and only start counting when numerical values
    // are encountered to avoid rendering zeros when the sum isn't actually zero
    return Object.entries(dataElementValues).reduce(
        (sum, [cocId, valueDetails]) => {
            const fieldHasError = formErrors?.[dataElementId]?.[cocId]

            const value = valueDetails?.value

            if (!fieldHasError && !isNaN(value)) {
                sum = isNaN(sum) ? value : sum + Number(value)
            }
            return sum
        },
        null
    )
}

export const CustomFormTotalCell = ({ dataElementId }) => {
    const dataValues = useValueStore((state) => state.getDataValues())
    const formErrors = useEntryFormStore((state) => state.getErrors())

    const blurredField = useBlurredField()
    const [total, setTotal] = useState(() =>
        computeTotal(dataElementId, dataValues, formErrors)
    )

    useEffect(() => {
        const { dataElementId: blurredFieldDataElementId } =
            parseFieldId(blurredField)
        if (blurredFieldDataElementId === dataElementId) {
            setTotal(computeTotal(dataElementId, dataValues, formErrors))
        }
    }, [blurredField, dataElementId, dataValues, formErrors])

    return <TotalCell>{total}</TotalCell>
}
CustomFormTotalCell.propTypes = {
    dataElementId: PropTypes.string.isRequired,
}

export const replaceTotalCell = (dataElementId) => (
    <CustomFormTotalCell dataElementId={dataElementId} />
)
