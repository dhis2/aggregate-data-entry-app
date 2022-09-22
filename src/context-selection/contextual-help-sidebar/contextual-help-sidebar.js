import i18n from '@dhis2/d2-i18n'
import React from 'react'
import { Sidebar, SidebarProps, Title } from '../../shared/index.js'
import CellsLegend from './cells-legend.js'
import Shortcuts from './shortcuts.js'

export default function ContextualHelpSidebar({ hide }) {
    return (
        <Sidebar>
            <Title onClose={hide}>{i18n.t('Help')}</Title>
            <CellsLegend />
            <Shortcuts />
        </Sidebar>
    )
}

ContextualHelpSidebar.propTypes = SidebarProps
