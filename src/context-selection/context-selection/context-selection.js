import { SelectorBar } from '@dhis2/ui'
import React from 'react'
import { useRightHandPanelContext } from '../../right-hand-panel/index.js'
import {
    noFormOrLockedStates,
    useClearEntireSelection,
    useManageInterParamDependencies,
    useNoFormOrLockedContext,
    useCheckLockStatus,
} from '../../shared/index.js'
import { AttributeOptionComboSelectorBarItem } from '../attribute-option-combo-selector-bar-item/index.js'
import { DataSetSelectorBarItem } from '../data-set-selector-bar-item/index.js'
import { OrgUnitSetSelectorBarItem } from '../org-unit-selector-bar-item/index.js'
import { PeriodSelectorBarItem } from '../period-selector-bar-item/index.js'
import { SectionFilterSelectorBarItem } from '../section-filter-selector-bar-item/index.js'
import RightHandSideContent from './right-hand-side-content.js'
import useShouldHideClearButton from './use-should-hide-clear-button.js'

export default function ContextSelector() {
    useManageInterParamDependencies()
    useCheckLockStatus()

    const { hide } = useRightHandPanelContext()
    const hideClearButton = useShouldHideClearButton()
    const clearEntireSelection = useClearEntireSelection()
    const { setNoFormOrLockedStatus } = useNoFormOrLockedContext()
    const onClearSelectionClick = () => {
        setNoFormOrLockedStatus(noFormOrLockedStates.OPEN)

        if (!hideClearButton) {
            clearEntireSelection()
            hide()
        }
    }

    return (
        <SelectorBar
            onClearSelectionClick={onClearSelectionClick}
            additionalContent={<RightHandSideContent />}
        >
            <DataSetSelectorBarItem />
            <OrgUnitSetSelectorBarItem />
            <PeriodSelectorBarItem />
            <AttributeOptionComboSelectorBarItem />
            <SectionFilterSelectorBarItem />
        </SelectorBar>
    )
}
