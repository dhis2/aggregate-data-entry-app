import i18n from '@dhis2/d2-i18n'
import { FlyoutMenu, MenuItem, MenuDivider, DropdownButton } from '@dhis2/ui'
import React, { useState } from 'react'
import { useRightHandPanelContext } from '../../right-hand-panel/index.js'

export default function Options() {
    const rightHandPanel = useRightHandPanelContext()
    const [showMenu, setShowMenu] = useState(false)

    const optionsMenu = (
        <FlyoutMenu>
            <MenuItem label={i18n.t('Print form with values')} disabled />
            <MenuItem label={i18n.t('Print empty form')} disabled />
            <MenuDivider />
            <MenuItem
                label={i18n.t('Help')}
                onClick={() => {
                    rightHandPanel.show('contextual-help')
                    setShowMenu(false)
                }}
            />
        </FlyoutMenu>
    )

    return (
        <>
            <DropdownButton
                small
                open={showMenu}
                onClick={() => setShowMenu(!showMenu)}
                secondary
                component={optionsMenu}
            >
                {i18n.t('Options')}
            </DropdownButton>
        </>
    )
}
