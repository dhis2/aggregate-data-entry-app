import { attributesToProps } from 'html-react-parser'
import React from 'react'
import { IndicatorTableCell } from '../indicators-table-body/indicator-table-cell.js'
import { CustomFormTotalCell } from './custom-form-total-cell.js'

const replaceTotalCell = (dataElementId) => (
    <CustomFormTotalCell dataElementId={dataElementId} />
)

const replaceIndicatorCell = (indicatorId, metadata) => {
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
        />
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

    const isInputTag = onlyChild.type === 'tag' && onlyChild.name === 'input'

    if (
        onlyChild &&
        isInputTag &&
        onlyChild.attribs.name === 'indicator' &&
        onlyChild.attribs.indicatorid
    ) {
        return replaceIndicatorCell(onlyChild.attribs.indicatorid, metadata)
    }

    if (
        onlyChild &&
        isInputTag &&
        onlyChild.attribs.name === 'total' &&
        onlyChild.attribs.dataelementid
    ) {
        return replaceTotalCell(onlyChild.attribs.dataelementid)
    }

    return undefined
}
