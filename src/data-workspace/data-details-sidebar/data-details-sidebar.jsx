import i18n from '@dhis2/d2-i18n'
import React, { useEffect } from 'react'
import {
    Sidebar,
    SidebarProps,
    Title,
    useHighlightedField,
} from '../../shared/index.js'
import AuditLog from './audit-log.jsx'
import BasicInformation from './basic-information.jsx'
import Comment from './comment.jsx'
import History from './history.jsx'
import Limits from './limits.jsx'

export default function DataDetailsSidebar({ hide }) {
    const dataValue = useHighlightedField()

    useEffect(() => {
        if (!dataValue) {
            hide()
        }
    }, [dataValue, hide])

    if (!dataValue) {
        return null
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
