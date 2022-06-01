import { attributesToProps } from 'html-react-parser'
import React from 'react'

const TD_LABEL_CLASS = 'dhis2-data-entry-app-custom-form-label-cell'

export const replaceTdNode = (domNode) => {
    const hasSingleTextNodeChild =
        domNode.children.length === 1 && domNode.children[0].type === 'text'

    if (hasSingleTextNodeChild) {
        const cleanedText = domNode.children[0].nodeValue.trim()
        const props = attributesToProps(domNode.attribs)

        if (cleanedText.length === 0) {
            /*
             * Custom form td tags tend to have non-visible characters
             * in them which prevent the CSS :empty selector from being
             * applied. This fixes that.
             */
            return <td {...props} />
        } else {
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
    }
}
