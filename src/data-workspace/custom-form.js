import i18n from '@dhis2/d2-i18n'
import { NoticeBox } from '@dhis2/ui'
import React from 'react'

export const CustomForm = () => (
    <NoticeBox title={i18n.t('Not implemented')} warning>
        {i18n.t(
            'This data set uses a custom form. Custom forms are not implemented yet.'
        )}
    </NoticeBox>
)
