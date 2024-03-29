import i18n from '@dhis2/d2-i18n'
import { Button, Tooltip } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import {
    useOrgUnitId,
    useConnectionStatus,
    useCanUserEditFields,
} from '../../shared/index.js'
import { useDeleteLimits } from '../min-max-limits-mutations/index.js'

const label = i18n.t('Delete limits')

export default function LimitsDeleteButton({
    dataElementId,
    categoryOptionComboId,
    disabled,
}) {
    const canEditFields = useCanUserEditFields()
    const { offline } = useConnectionStatus()
    const [orgUnitId] = useOrgUnitId()
    const deleteLimit = useDeleteLimits()

    if (!canEditFields) {
        return (
            <Tooltip
                content={i18n.t(
                    'You do not have the authority to delete limits'
                )}
            >
                <Button small secondary disabled>
                    {label}
                </Button>
            </Tooltip>
        )
    }

    if (offline) {
        return (
            <Tooltip content={i18n.t('Not available offline')}>
                <Button small secondary disabled>
                    {label}
                </Button>
            </Tooltip>
        )
    }

    const onClick = async () => {
        await deleteLimit.mutate({
            categoryOptionCombo: categoryOptionComboId,
            dataElement: dataElementId,
            orgUnit: orgUnitId,
        })
    }

    return (
        <Button
            small
            secondary
            onClick={onClick}
            loading={deleteLimit.isLoading}
            disabled={disabled}
        >
            {label}
        </Button>
    )
}

LimitsDeleteButton.propTypes = {
    categoryOptionComboId: PropTypes.string.isRequired,
    dataElementId: PropTypes.string.isRequired,
    disabled: PropTypes.bool,
}
