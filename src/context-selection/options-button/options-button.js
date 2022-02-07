import i18n from '@dhis2/d2-i18n'
import { DropdownButton } from '@dhis2/ui'
import React from 'react'
import Options from './options.js'

const OptionsButton = () => (
    <DropdownButton small secondary component={<Options />}>
        {i18n.t('Options')}
    </DropdownButton>
)

export default OptionsButton
