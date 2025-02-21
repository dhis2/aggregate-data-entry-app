import i18n from '@dhis2/d2-i18n'
import { Button, Tooltip } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import {
    useConnectionStatus,
    useCanUserEditFields,
} from '../../shared/index.js'
import noLimitsStyles from './no-limits.module.css'

const buttonLabel = i18n.t('Add limits')

function AddButton({ onAddLimitsClick }) {
    const canEditFields = useCanUserEditFields()
    const { offline } = useConnectionStatus()

    if (!canEditFields) {
        return (
            <Tooltip
                content={i18n.t('You do not have the authority to add limits')}
            >
                <Button small secondary disabled>
                    {buttonLabel}
                </Button>
            </Tooltip>
        )
    }

    if (offline) {
        return (
            <Tooltip content={i18n.t('Not available offline')}>
                <Button small secondary disabled>
                    {buttonLabel}
                </Button>
            </Tooltip>
        )
    }

    return (
        <Button small secondary onClick={onAddLimitsClick}>
            {buttonLabel}
        </Button>
    )
}

AddButton.propTypes = {
    onAddLimitsClick: PropTypes.func.isRequired,
}

export default function NoLimits({ onAddLimitsClick, canAdd }) {
    return (
        <>
            <p className={noLimitsStyles.label}>
                {i18n.t('No limits set for this data item.')}
            </p>
            {canAdd && <AddButton onAddLimitsClick={onAddLimitsClick} />}
        </>
    )
}

NoLimits.propTypes = {
    onAddLimitsClick: PropTypes.func.isRequired,
    canAdd: PropTypes.bool,
}
