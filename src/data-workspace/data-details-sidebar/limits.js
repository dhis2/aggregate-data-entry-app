import i18n from '@dhis2/d2-i18n'
import PropTypes from 'prop-types'
import React, { useState, useEffect } from 'react'
import {
    ExpandableUnit,
    useUserInfo,
    userInfoSelectors,
    useUnsavedDataStore,
    useContextSelectionId,
} from '../../shared/index.js'
import { getCellId } from '../../shared/stores/unsaved-data-store.js'
import { useMinMaxLimits } from '../use-min-max-limits.js'
import LimitsDisplay from './limits-display.js'
import NoLimits from './no-limits.js'
import UpdateLimitsWrapper from './update-limits.js'

const title = i18n.t('Min and max limits')

export default function Limits({ dataValue }) {
    const [open, setOpen] = useState(true)
    const [editing, setEditing] = useState(false)
    const contextSelectionId = useContextSelectionId()

    const cellId = getCellId({ item: dataValue, contextSelectionId })
    const unsavedLimits = useUnsavedDataStore((state) => {
        return state.getUnsavedLimits(cellId)
    })

    const { valueType, dataElement, categoryOptionCombo, canHaveLimits } =
        dataValue
    const disabled = !canHaveLimits

    const limits = useMinMaxLimits(dataElement, categoryOptionCombo)

    const { data: userInfo } = useUserInfo()

    const canDelete = userInfoSelectors.getCanDeleteMinMax(userInfo)
    const canAdd = userInfoSelectors.getCanAddMinMax(userInfo)

    useEffect(() => {
        setEditing(false)
    }, [dataValue])

    const deleteUnsavedLimits = useUnsavedDataStore(
        (state) => state.deleteUnsavedLimits
    )

    const onDone = () => {
        setEditing(false)
        deleteUnsavedLimits(cellId)
    }

    if (!editing && !unsavedLimits && !limits.min && !limits.max) {
        const onAddLimitsClick = () => setEditing(true)
        return (
            <ExpandableUnit
                title={title}
                disabled={disabled}
                open={open}
                onToggle={setOpen}
            >
                <NoLimits onAddLimitsClick={onAddLimitsClick} canAdd={canAdd} />
            </ExpandableUnit>
        )
    }

    if (editing || unsavedLimits) {
        return (
            <ExpandableUnit
                title={title}
                disabled={disabled}
                open={open}
                onToggle={setOpen}
            >
                <UpdateLimitsWrapper
                    dataElementId={dataElement}
                    categoryOptionComboId={categoryOptionCombo}
                    limits={limits}
                    valueType={valueType}
                    onCancel={onDone}
                    onDone={onDone}
                    canAdd={canAdd}
                    canDelete={canDelete}
                    unsavedLimits={unsavedLimits}
                    cellId={cellId}
                />
            </ExpandableUnit>
        )
    }

    return (
        <ExpandableUnit
            title={title}
            disabled={disabled}
            open={open}
            onToggle={setOpen}
        >
            <LimitsDisplay
                dataElementId={dataElement}
                categoryOptionComboId={categoryOptionCombo}
                max={limits.max}
                min={limits.min}
                onEditClick={() => setEditing(true)}
                canAdd={canAdd}
                canDelete={canDelete}
            />
        </ExpandableUnit>
    )
}

Limits.propTypes = {
    dataValue: PropTypes.shape({
        canHaveLimits: PropTypes.bool.isRequired,
        categoryOptionCombo: PropTypes.string.isRequired,
        dataElement: PropTypes.string.isRequired,
        valueType: PropTypes.string.isRequired,
    }).isRequired,
}
