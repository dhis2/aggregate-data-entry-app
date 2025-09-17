import { composeValidators, hasValue } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import { Form } from 'react-final-form'
import { useOrgUnitId } from '../../shared/index.js'
import { createLessThan, minMaxValidatorsByValueType } from '../inputs/index.js'
import { useUpdateLimits } from '../min-max-limits-mutations/index.js'
import limitInputLabelsByName from './limits-input-labels-by-name.js'

export default function LimitsFormWrapper({
    categoryOptionComboId,
    dataElementId,
    valueType,
    onDone,
    children,
}) {
    const [orgUnitId] = useOrgUnitId()
    const { mutate: updateLimits } = useUpdateLimits(onDone)

    const onSubmit = async ({ min, max }) =>
        await updateLimits({
            categoryOptionCombo: categoryOptionComboId,
            dataElement: dataElementId,
            orgUnit: orgUnitId,
            minValue: parseFloat(min),
            maxValue: parseFloat(max),
        })

    const validator = minMaxValidatorsByValueType[valueType]
    const validateMin = composeValidators(
        hasValue,
        validator,
        createLessThan('max', limitInputLabelsByName.max)
    )

    // No need to check whether this is really more
    // than "min" as "min" is already checking
    // whether it's less than "max"
    const validateMax = composeValidators(hasValue, validator)

    const validate = (values) => {
        let errors = undefined

        const minError = validateMin(values.min, values)
        if (minError) {
            if (!errors) {
                errors = {}
            }

            errors.min = minError
        }

        const maxError = validateMax(values.max, values)
        if (maxError) {
            if (!errors) {
                errors = {}
            }

            errors.max = maxError
        }

        return errors
    }

    return (
        <Form onSubmit={onSubmit} validate={validate}>
            {() => children}
        </Form>
    )
}

LimitsFormWrapper.propTypes = {
    categoryOptionComboId: PropTypes.string.isRequired,
    children: PropTypes.any.isRequired,
    dataElementId: PropTypes.string.isRequired,
    valueType: PropTypes.string.isRequired,
    onDone: PropTypes.func.isRequired,
}
