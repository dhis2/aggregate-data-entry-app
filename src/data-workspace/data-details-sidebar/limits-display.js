import i18n from '@dhis2/d2-i18n'
import { Button, ButtonStrip, Tooltip } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import {
    useConnectionStatus,
    useNoFormOrLockedContext,
} from '../../shared/index.js'
import calculateAverage from './calculate-average.js'
import LimitsAverageValueInfo from './limits-average-value-info.js'
import LimitsDeleteButton from './limits-delete-button.js'
import styles from './limits.module.css'

const editButtonLabel = i18n.t('Edit limits')

function EditButton({ onClick, disabled }) {
    const { offline } = useConnectionStatus()

    if (offline) {
        return (
            <Tooltip content={i18n.t('Not available offline')}>
                <Button small primary disabled={disabled}>
                    {editButtonLabel}
                </Button>
            </Tooltip>
        )
    }

    return (
        <Button small primary onClick={onClick} disabled={disabled}>
            {editButtonLabel}
        </Button>
    )
}

EditButton.propTypes = {
    onClick: PropTypes.func.isRequired,
    disabled: PropTypes.bool,
}

export default function LimitsDisplay({
    categoryOptionComboId,
    dataElementId,
    min,
    max,
    onEditClick,
}) {
    const average = calculateAverage(min, max)
    const { locked } = useNoFormOrLockedContext()

    return (
        <div className={styles.limits}>
            <LimitsAverageValueInfo avg={average} />

            <div>
                {min !== null && (
                    <div className={styles.limit}>
                        <span className={styles.limitLabel}>
                            {i18n.t('Minimum')}
                        </span>
                        <span className={styles.limitValue}>{min}</span>
                    </div>
                )}

                {min !== null && max !== null && (
                    <div className={styles.spaceBetween}></div>
                )}

                {max !== null && (
                    <div className={styles.limit}>
                        <span className={styles.limitLabel}>
                            {i18n.t('Maximum')}
                        </span>
                        <span className={styles.limitValue}>{max}</span>
                    </div>
                )}
            </div>

            <ButtonStrip>
                <EditButton onClick={onEditClick} disabled={locked} />
                <LimitsDeleteButton
                    dataElementId={dataElementId}
                    categoryOptionComboId={categoryOptionComboId}
                    disabled={locked}
                />
            </ButtonStrip>
        </div>
    )
}

LimitsDisplay.propTypes = {
    categoryOptionComboId: PropTypes.string.isRequired,
    dataElementId: PropTypes.string.isRequired,
    onEditClick: PropTypes.func.isRequired,
    max: PropTypes.number,
    min: PropTypes.number,
}
