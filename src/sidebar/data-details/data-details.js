import i18n from '@dhis2/d2-i18n'
import { CircularLoader, NoticeBox } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { useEffect, useState } from 'react'
import { useQuery } from 'react-query'
import {
    useOrgUnitId,
    usePeriodId,
    useIsValidSelection,
} from '../../context-selection/index.js'
import { useApiAttributeParams } from '../../shared/index.js'
import { useSidebar } from '../context/index.js'
import queryKeyFactory from '../query-key-factory.js'
import ToggleableUnit from '../toggleable-unit.js'
import AuditLog from './audit-log.js'
import BasicInformation from './basic-information.js'
import Comment from './comment.js'
import HistoryUnit from './history-unit.js'
import ItemPropType from './item-prop-type.js'
// import Limits from './limits.js'

export default function DataDetails({
    item,
    onMarkForFollowup,
    onUnmarkForFollowup,
}) {
    const [periodId] = usePeriodId()
    const [orgUnitId] = useOrgUnitId()
    const { attributeCombo, attributeOptions } = useApiAttributeParams()

    const isValidSelection = useIsValidSelection()
    const [prevIsValidSelection, setPrevIsValidSelection] =
        useState(isValidSelection)

    const dataValueContextQueryKey = queryKeyFactory.dataValueContext.byParams({
        dataElementId: item.dataElement,
        periodId: periodId,
        orgUnitId: orgUnitId,
        categoryOptionIds: attributeOptions,
        categoryComboId: attributeCombo,
        categoryOptionComboId: item.categoryOptionCombo,
    })

    const dataValueContext = useQuery(dataValueContextQueryKey, {
        enabled: isValidSelection,
    })

    const sidebar = useSidebar()
    useEffect(() => {
        // When valid -> invalid, then close
        if (prevIsValidSelection && !isValidSelection) {
            sidebar.close()
        }

        // If different, override prev value with current value
        if (prevIsValidSelection !== isValidSelection) {
            setPrevIsValidSelection(isValidSelection)
        }
    }, [
        prevIsValidSelection,
        setPrevIsValidSelection,
        isValidSelection,
        sidebar,
    ])

    return (
        <>
            <BasicInformation
                item={item}
                onMarkForFollowup={onMarkForFollowup}
                onUnmarkForFollowup={onUnmarkForFollowup}
            />

            <Comment comment={item.comment} />

            {/* <Limits itemId={item.id} itemType={item.type} /> */}

            {dataValueContext.isLoading && (
                <ToggleableUnit
                    title={i18n.t('History and audit')}
                    initiallyOpen
                >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContext: 'center' }}>
                        <CircularLoader small />
                    </div>
                </ToggleableUnit>
            )}

            {dataValueContext.error && (
                <ToggleableUnit
                    title={i18n.t('History and audit')}
                    initiallyOpen
                >
                    <NoticeBox
                        title={i18n.t(
                            'Something went wrong loading the history and audit log'
                        )}
                    >
                        <p>{dataValueContext.error.message}</p>
                    </NoticeBox>
                </ToggleableUnit>
            )}

            {dataValueContext.data && (
                <>
                    <HistoryUnit
                        loading={
                            dataValueContext.isIdle || dataValueContext.loading
                        }
                        history={dataValueContext.data?.history}
                    />

                    <AuditLog
                        loading={
                            dataValueContext.isIdle || dataValueContext.loading
                        }
                        audits={dataValueContext.data?.audits}
                    />
                </>
            )}
        </>
    )
}

DataDetails.propTypes = {
    item: ItemPropType.isRequired,
    onMarkForFollowup: PropTypes.func.isRequired,
    onUnmarkForFollowup: PropTypes.func.isRequired,
}
