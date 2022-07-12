import { attributesToProps } from 'html-react-parser'
import PropTypes from 'prop-types'
import React, { useState, useEffect } from 'react'
import { useForm } from 'react-final-form'
import { useBlurredField } from '../../shared/use-blurred-field.js'
import { TotalCell } from '../category-combo-table-body/total-cells.js'
import { IndicatorTableCell } from '../indicators-table-body/indicator-table-cell.js'

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
            hasValidationErrors && errors[`${dataElementId}.${cocId}`]

        if (!fieldHasError && !isNaN(value)) {
            sum = isNaN(sum) ? value : sum + Number(value)
        }
        return sum
    }, null)
}

const CustomFormTotalCell = ({ dataElementId }) => {
    const form = useForm()
    const blurredField = useBlurredField()
    const [total, setTotal] = useState(() =>
        computeTotal(dataElementId, form.getState())
    )

    useEffect(() => {
        const blurredFieldDataElementId = blurredField?.split('.')[0]
        if (blurredFieldDataElementId === dataElementId) {
            setTotal(computeTotal(dataElementId, form.getState()))
        }
    }, [blurredField, dataElementId, form])

    return <TotalCell>{total}</TotalCell>
}

CustomFormTotalCell.propTypes = {
    dataElementId: PropTypes.string.isRequired,
}

const replaceTotalCell = (dataElementId) => (
    <CustomFormTotalCell dataElementId={dataElementId} />
)

const replaceIndicatorCell = (indicatorId, metadata) => {
    const { denominator, numerator } = metadata.indicators[indicatorId]
    return (
        <IndicatorTableCell denominator={denominator} numerator={numerator} />
    )
}

const replaceTextCell = (domNode) => {
    const cleanedText = domNode.children[0].nodeValue.trim()
    const props = attributesToProps(domNode.attribs)

    /*
     * Custom form td tags tend to have non-visible characters
     * in them which prevent the CSS :empty selector from being
     * applied. This fixes that.
     */
    if (cleanedText.length === 0) {
        return <td {...props} />
    }

    /*
     * Cells which contain only text should get some padding to
     * match the default and section forms
     */
    return (
        <td {...props} className="dhis2-data-entry-app-custom-form-label-cell">
            {cleanedText}
        </td>
    )
}

export const replaceTdNode = (domNode, metadata) => {
    const onlyChild = domNode.children.length === 1 && domNode.children[0]

    if (onlyChild && onlyChild.type === 'text') {
        return replaceTextCell(domNode)
    }

    if (
        onlyChild &&
        onlyChild.type === 'tag' &&
        onlyChild.name === 'input' &&
        onlyChild.attribs.name === 'indicator' &&
        onlyChild.attribs.indicatorid
    ) {
        return replaceIndicatorCell(onlyChild.attribs.indicatorid, metadata)
    }

    if (
        onlyChild &&
        onlyChild.type === 'tag' &&
        onlyChild.name === 'input' &&
        onlyChild.attribs.name === 'total' &&
        onlyChild.attribs.dataelementid
    ) {
        return replaceTotalCell(onlyChild.attribs.dataelementid)
    }

    return undefined
}
