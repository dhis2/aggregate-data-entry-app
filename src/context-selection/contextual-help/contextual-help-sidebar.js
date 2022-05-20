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
            <Title onClose={rightHandPanel.hide}>{i18n.t('Help')}</Title>
            <CellReference />
            <Shortcuts />
        </Sidebar>
    )
}
