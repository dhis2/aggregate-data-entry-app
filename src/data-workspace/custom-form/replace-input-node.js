import React from 'react'
import { selectors } from '../../shared/index.js'
import { DataEntryField } from '../data-entry-cell/index.js'

const INPUT_TYPES = {
    ENTRYFIELD: 'ENTRYFIELD',
    INDICATOR: 'INDICATOR',
    TOTAL: 'TOTAL',
}

const getInputType = (domNode) => {
    const { attribs } = domNode
    if (attribs.id.startsWith('total')) {
        return INPUT_TYPES.TOTAL
    }
    if (attribs.id.startsWith('indicator')) {
        return INPUT_TYPES.INDICATOR
    } else {
        // id is in the format `${deId}-${cocId}-val`
        const [deId, cocId, val] = attribs.id.split('-')
        if (deId && cocId && val === 'val') {
            return INPUT_TYPES.ENTRYFIELD
        }
    }
}

export const replaceInputNode = (domNode, metadata) => {
    const inputType = getInputType(domNode)
    // TODO: This was already there when I started on this branch
    // Need to check with Kai what his intentions were with it.
    // const cellProps = getCellPropsByInputType(inputType)

    if (inputType !== INPUT_TYPES.ENTRYFIELD) {
        return undefined
    }

    const [deId, cocId] = domNode.attribs.id.split('-')
    const dataElement = selectors.getDataElementById(metadata, deId)

    return (
        <DataEntryField
            dataElement={dataElement}
            categoryOptionCombo={{ id: cocId }}
        />
    )
}
