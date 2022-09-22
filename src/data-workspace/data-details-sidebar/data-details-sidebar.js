import i18n from '@dhis2/d2-i18n'
import React from 'react'
import {
    Sidebar,
    SidebarProps,
    Title,
    useDataValueSet,
    useHighlightedField,
} from '../../shared/index.js'
import AuditLog from './audit-log.js'
import BasicInformation from './basic-information.js'
import Comment from './comment.js'
import History from './history.js'
import Limits from './limits.js'

export default function DataDetailsSidebar({ hide }) {
    const dataValueSet = useDataValueSet()
    const item = useHighlightedField()

    const dataValue = {
        ...item,
        ...dataValueSet.data?.dataValues[item.dataElement]?.[
            item.categoryOptionCombo
        ],
    }

    return (
        <Sidebar>
            <Title onClose={hide}>{i18n.t('Details')}</Title>
            <BasicInformation item={dataValue} />
            <Comment item={dataValue} />
            <Limits dataValue={dataValue} />
            <History item={dataValue} />
            <AuditLog item={dataValue} />
        </Sidebar>
    )
}
DataDetailsSidebar.propTypes = SidebarProps
