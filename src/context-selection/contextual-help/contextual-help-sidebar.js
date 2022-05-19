import i18n from '@dhis2/d2-i18n'
import React from 'react'
import { useRightHandPanelContext } from '../../right-hand-panel/index.js'
import { Sidebar, Title } from '../../shared/index.js'
import CellReference from './cell-reference.js'
import Shortcuts from './shortcuts.js'

export default function ContextualHelpSidebar() {
    const rightHandPanel = useRightHandPanelContext()

    return (
        <Sidebar>
            <Title title={i18n.t('Help')} onClose={rightHandPanel.hide} />
            <CellReference />
            <Shortcuts />
        </Sidebar>
    )
}
