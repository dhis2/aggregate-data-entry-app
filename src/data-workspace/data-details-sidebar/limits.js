import i18n from '@dhis2/d2-i18n'
import PropTypes from 'prop-types'
import React, { useState } from 'react'
import { ExpandableUnit } from '../../shared/index.js'
import { useMinMaxLimits } from '../use-min-max-limits.js'
import LimitsDisplay from './limits-display.js'
import NoLimits from './no-limits.js'
import UpdateLimits from './update-limits.js'

const title = i18n.t('Minimum and maximum limits')

export default function Limits({ dataValue }) {
    const [open, setOpen] = useState(true)
    const [editing, setEditing] = useState(false)

    const { valueType, dataElement, categoryOptionCombo, canHaveLimits } =
        dataValue
    const disabled = !canHaveLimits

    const limits = useMinMaxLimits(dataElement, categoryOptionCombo)

    if (!editing && !limits.min && !limits.max) {
        const onAddLimitsClick = () => setEditing(true)
        return (
            <ExpandableUnit
                title={title}
                disabled={disabled}
                open={open}
                onToggle={setOpen}
            >
                <NoLimits onAddLimitsClick={onAddLimitsClick} />
            </ExpandableUnit>
        )
    }

    if (editing) {
        return (
            <ExpandableUnit
                title={title}
                disabled={disabled}
                open={open}
                onToggle={setOpen}
            >
                <UpdateLimits
                    dataElementId={dataElement}
                    categoryOptionComboId={categoryOptionCombo}
                    limits={limits}
                    valueType={valueType}
                    onCancel={() => setEditing(false)}
                    onDone={() => setEditing(false)}
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
