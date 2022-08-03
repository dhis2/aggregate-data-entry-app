import i18n from '@dhis2/d2-i18n'
import React from 'react'
import {
    Sidebar,
    SidebarProps,
    Title,
    useDataValueSet,
    useHighlightedField,
    useOrgUnitId,
} from '../../shared/index.js'
import AuditLog from './audit-log.js'
import BasicInformation from './basic-information.js'
import Comment from './comment.js'
import History from './history.js'
import Limits from './limits.js'

export default function DataDetailsSidebar({ hide }) {
    const [orgUnitId] = useOrgUnitId()
    const dataValueSet = useDataValueSet()
    const item = useHighlightedField()
    const dataValue = {
        ...item,
        ...dataValueSet.data?.dataValues[item.dataElement]?.[
            item.categoryOptionCombo
        ],
    }

    const onMarkForFollowup = () => null
    const onUnmarkForFollowup = () => null

    // Searches the response of `useDataValueSet` for the minMaxValue that
    // belongs to the currently displayed data details by comparing the
    // minMaxValue's coc, de and ou with the data value's coc, de and ou
    const minMaxValue = dataValueSet.data?.minMaxValues.find(
        (curMinMaxValue) => {
            return (
                curMinMaxValue.categoryOptionCombo ===
                    dataValue.categoryOptionCombo &&
                curMinMaxValue.dataElement === dataValue.dataElement &&
                curMinMaxValue.orgUnit === orgUnitId
            )
        }
    )

    const limits = {
        min: minMaxValue?.minValue,
        max: minMaxValue?.maxValue,
    }

    return (
        <Sidebar>
            <Title onClose={hide}>{i18n.t('Details')}</Title>
            <BasicInformation
                item={dataValue}
                onMarkForFollowup={onMarkForFollowup}
                onUnmarkForFollowup={onUnmarkForFollowup}
            />
            <Comment item={dataValue} />
            <Limits dataValue={dataValue} limits={limits} />
            <History item={dataValue} />
            <AuditLog item={dataValue} />
        </Sidebar>
    )
}
DataDetailsSidebar.propTypes = SidebarProps
