import i18n from '@dhis2/d2-i18n'
import { FlyoutMenu, MenuItem, MenuDivider } from '@dhis2/ui'
import React from 'react'

const Options = () => (
    <FlyoutMenu>
        <MenuItem label={i18n.t('Print form with values')} disabled />
        <MenuItem label={i18n.t('Print empty form')} disabled />
        <MenuDivider />
        <MenuItem label={i18n.t('Help')} />
    </FlyoutMenu>
)

export default Options
