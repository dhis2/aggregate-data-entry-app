import { SelectorBar } from '@dhis2/ui'
import React from 'react'
import { AttributeOptionComboSelectorBarItem } from '../attribute-option-combo-selector-bar-item/index.js'
import { DataSetSelectorBarItem } from '../data-set-selector-bar-item/index.js'
import { OrgUnitSetSelectorBarItem } from '../org-unit-selector-bar-item/index.js'
import { PeriodSelectorBarItem } from '../period-selector-bar-item/index.js'
import { SectionFilterSelectorBarItem } from '../section-filter-selector-bar-item/index.js'
import { useClearEntireSelection } from '../use-context-selection/index.js'
import useShouldHideClearButton from './use-should-hide-clear-button.js'

export default function ContextSelector() {
    const hideClearButton = useShouldHideClearButton()
    const clearEntireSelection = useClearEntireSelection()
    const onClearSelectionClick = hideClearButton
        ? undefined
        : clearEntireSelection

    return (
        <SelectorBar onClearSelectionClick={onClearSelectionClick}>
            <DataSetSelectorBarItem />
            <OrgUnitSetSelectorBarItem />
            <PeriodSelectorBarItem />
            <AttributeOptionComboSelectorBarItem />
            <SectionFilterSelectorBarItem />
        </SelectorBar>
    )
}
