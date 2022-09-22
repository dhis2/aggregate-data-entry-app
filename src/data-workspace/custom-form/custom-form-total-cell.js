import PropTypes from 'prop-types'
import React, { useState, useEffect } from 'react'
import { useForm } from 'react-final-form'
import { useBlurredField } from '../../shared/use-blurred-field.js'
import { TotalCell } from '../category-combo-table-body/total-cells.js'
import { getFieldId, parseFieldId } from '../get-field-id.js'

const computeTotal = (dataElementId, formState) => {
    const { values, hasValidationErrors, errors } = formState
    const dataElementValues = values[dataElementId]

    if (!dataElementValues) {
        return null
    }

    // Initialise sum as null and only start counting when numerical values
    // are encountered to avoid rendering zeros when the sum isn't actually zero
    return Object.entries(dataElementValues).reduce((sum, [cocId, value]) => {
        const fieldHasError =
            hasValidationErrors && errors[getFieldId(dataElementId, cocId)]

        if (!fieldHasError && !isNaN(value)) {
            sum = isNaN(sum) ? value : sum + Number(value)
        }
        return sum
    }, null)
}

export const CustomFormTotalCell = ({ dataElementId }) => {
    const form = useForm()
    const blurredField = useBlurredField()
    const [total, setTotal] = useState(() =>
        computeTotal(dataElementId, form.getState())
    )

    useEffect(() => {
        const { dataElementId: blurredFieldDataElementId } =
            parseFieldId(blurredField)
        if (blurredFieldDataElementId === dataElementId) {
            setTotal(computeTotal(dataElementId, form.getState()))
        }
    }, [blurredField, dataElementId, form])

    return <TotalCell>{total}</TotalCell>
}
CustomFormTotalCell.propTypes = {
    dataElementId: PropTypes.string.isRequired,
}
