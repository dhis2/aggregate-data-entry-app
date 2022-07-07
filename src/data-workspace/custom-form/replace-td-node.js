import { attributesToProps } from 'html-react-parser'
import React from 'react'
import { TotalCell } from '../category-combo-table/total-cells.js'

const TD_LABEL_CLASS = 'dhis2-data-entry-app-custom-form-label-cell'

const computeTotal = (values) => {
    if (!values) {
        return null
    }

    // Initialise sum as null and only start counting when numerical values
    // are encountered to avoid rendering zeros when the sum isn't actually zero
    return Object.values(values).reduce((sum, value) => {
        if (!isNaN(value)) {
            sum = isNaN(sum) ? value : sum + Number(value)
        }
        return sum
    }, null)
}

const replaceTotalCell = (dataElementId, formState) => {
    // Get values from all cells associated with this data element from form state and sum them.
    // Object passed to computeTotal should look like `{ [cocId1]: val1, [cocId2]: val2, ... }`
    const total = computeTotal(formState.values[dataElementId])

    return <TotalCell>{total}</TotalCell>
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
        <td {...props} className={TD_LABEL_CLASS}>
            {cleanedText}
        </td>
    )
}

export const replaceTdNode = (domNode, formState) => {
    const onlyChild = domNode.children.length === 1 && domNode.children[0]

    if (onlyChild && onlyChild.type === 'text') {
        return replaceTextCell(domNode)
    }

    if (
        onlyChild &&
        onlyChild.type === 'tag' &&
        onlyChild.name === 'input' &&
        onlyChild.attribs.name === 'total' &&
        onlyChild.attribs.dataelementid
    ) {
        return replaceTotalCell(onlyChild.attribs.dataelementid, formState)
    }

    return undefined
}