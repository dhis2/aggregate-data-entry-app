import { SelectorBar } from '@dhis2-ui/selector-bar'
import React from 'react'
import { DataSetSelectorBarItem } from './data-set-selector-bar-item/index.js'

export default function ContextSelector() {
    return (
        <SelectorBar>
            <DataSetSelectorBarItem />
        </SelectorBar>
    )
}
