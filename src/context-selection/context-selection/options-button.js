import i18n from '@dhis2/d2-i18n'
import { DropdownButton, FlyoutMenu, MenuItem, MenuDivider } from '@dhis2/ui'
import React, { useState } from 'react'
import {
    useRightHandPanelContext,
    RightHandPanelPortal,
} from '../../right-hand-panel/index.js'
import {
    ContextualHelpSidebar,
    contextualHelpConstants,
} from '../contextual-help/index.js'

const OptionsButton = () => {
    const [showMenu, setShowMenu] = useState(false)
    const rightHandPanel = useRightHandPanelContext()

    return (
        <>
            <DropdownButton
                small
                open={showMenu}
                onClick={() => setShowMenu(!showMenu)}
                secondary
                component={
                    <FlyoutMenu>
                        <MenuItem
                            label={i18n.t('Print form with values')}
                            disabled
                        />
                        <MenuItem label={i18n.t('Print empty form')} disabled />
                        <MenuDivider />
                        <MenuItem
                            label={i18n.t('Help')}
                            onClick={() => {
                                rightHandPanel.show(
                                    contextualHelpConstants.rightHandPanelId
                                )

                                setShowMenu(false)
                            }}
                        />
                    </FlyoutMenu>
                }
            >
                {i18n.t('Options')}
            </DropdownButton>

            <RightHandPanelPortal id={contextualHelpConstants.rightHandPanelId}>
                <ContextualHelpSidebar />
            </RightHandPanelPortal>
        </>
    )
}

export default OptionsButton
