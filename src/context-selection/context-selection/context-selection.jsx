import { SelectorBar } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import { useRightHandPanelContext } from '../../right-hand-panel/index.js'
import {
    useClearEntireSelection,
    useManageInterParamDependencies,
} from '../../shared/index.js'
import { AttributeOptionComboSelectorBarItem } from '../attribute-option-combo-selector-bar-item/index.js'
import { DataSetSelectorBarItem } from '../data-set-selector-bar-item/index.js'
import { OrgUnitSetSelectorBarItem } from '../org-unit-selector-bar-item/index.js'
import { PeriodSelectorBarItem } from '../period-selector-bar-item/index.js'
import { SectionFilterSelectorBarItem } from '../section-filter-selector-bar-item/index.js'
import styles from './context-selection.module.css'
import RightHandSideContent from './right-hand-side-content.jsx'
import useShouldHideClearButton from './use-should-hide-clear-button.js'

export default function ContextSelector({ setSelectionHasNoFormMessage }) {
    useManageInterParamDependencies()

    const { hide } = useRightHandPanelContext()
    const hideClearButton = useShouldHideClearButton()
    const clearEntireSelection = useClearEntireSelection()
    const onClearSelectionClick = () => {
        setSelectionHasNoFormMessage('')

        if (!hideClearButton) {
            clearEntireSelection()
            hide()
        }
    }

    return (
        <div className={styles.hideForPrint}>
            <SelectorBar
                onClearSelectionClick={onClearSelectionClick}
                additionalContent={<RightHandSideContent />}
            >
                <DataSetSelectorBarItem />
                <OrgUnitSetSelectorBarItem />
                <PeriodSelectorBarItem />
                <AttributeOptionComboSelectorBarItem
                    setSelectionHasNoFormMessage={setSelectionHasNoFormMessage}
                />
                <SectionFilterSelectorBarItem />
            </SelectorBar>
        </div>
    )
}

ContextSelector.propTypes = {
    setSelectionHasNoFormMessage: PropTypes.func.isRequired,
}
