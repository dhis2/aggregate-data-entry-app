import i18n from '@dhis2/d2-i18n'
import { Button, ButtonStrip, Tooltip } from '@dhis2/ui'
import cx from 'classnames'
import PropTypes from 'prop-types'
import React from 'react'
import {
    useConnectionStatus,
    useCanUserEditFields,
} from '../../shared/index.js'
import calculateAverage from './calculate-average.js'
import LimitsAverageValueInfo from './limits-average-value-info.jsx'
import LimitsDeleteButton from './limits-delete-button.jsx'
import styles from './limits.module.css'

const editButtonLabel = i18n.t('Edit limits')

function EditButton({ onClick }) {
    const canEditFields = useCanUserEditFields()
    const { offline } = useConnectionStatus()

    if (!canEditFields) {
        return (
            <Tooltip
                content={i18n.t('You do not have the authority to add limits')}
            >
                <Button small primary disabled>
                    {editButtonLabel}
                </Button>
            </Tooltip>
        )
    }

    if (offline) {
        return (
            <Tooltip content={i18n.t('Not available offline')}>
                <Button small primary disabled>
                    {editButtonLabel}
                </Button>
            </Tooltip>
        )
    }

    return (
        <Button small primary onClick={onClick}>
            {editButtonLabel}
        </Button>
    )
}

EditButton.propTypes = {
    onClick: PropTypes.func.isRequired,
}

export default function LimitsDisplay({
    categoryOptionComboId,
    dataElementId,
    min,
    max,
    onEditClick,
    canAdd,
    canDelete,
}) {
    const average = calculateAverage(min, max)

    return (
        <div className={styles.limits}>
            <LimitsAverageValueInfo avg={average} />

            <div
                data-test="limits-display"
                className={cx(
                    styles.limitsDisplayWrapper,
                    styles.limitsDisplayWrapperMargin
                )}
            >
                {min !== null && (
                    <div className={styles.limit}>
                        <span className={styles.limitLabel}>
                            {i18n.t('Min')}
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
                            {i18n.t('Max')}
                        </span>
                        <span className={styles.limitValue}>{max}</span>
                    </div>
                )}
            </div>

            <ButtonStrip>
                {canAdd && <EditButton onClick={onEditClick} />}
                {canDelete && (
                    <div
                        className={cx({
                            [styles.onlyDeleteButton]: !canAdd && canDelete,
                        })}
                    >
                        <LimitsDeleteButton
                            dataElementId={dataElementId}
                            categoryOptionComboId={categoryOptionComboId}
                        />
                    </div>
                )}
            </ButtonStrip>
        </div>
    )
}

LimitsDisplay.propTypes = {
    categoryOptionComboId: PropTypes.string.isRequired,
    dataElementId: PropTypes.string.isRequired,
    onEditClick: PropTypes.func.isRequired,
    canAdd: PropTypes.bool,
    canDelete: PropTypes.bool,
    max: PropTypes.number,
    min: PropTypes.number,
}
