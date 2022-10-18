import { IconMore16, IconWarningFilled16, colors } from '@dhis2/ui'
import { useIsMutating } from '@tanstack/react-query'
import cx from 'classnames'
import PropTypes from 'prop-types'
import React, { useEffect } from 'react'
import { useField, useForm } from 'react-final-form'
import {
    mutationKeys as dataValueMutationKeys,
    useDataValueParams,
    useValueStore,
    useSyncErrorsStore,
} from '../../shared/index.js'
import styles from './data-entry-cell.module.css'
import { ValidationTooltip } from './validation-tooltip.js'

/** Three dots or triangle in top-right corner of cell */
const SyncStatusIndicator = ({ error, isLoading, isSynced }) => {
    let statusIcon = null
    if (isLoading) {
        statusIcon = <IconMore16 color={colors.grey700} />
    } else if (error) {
        statusIcon = <IconWarningFilled16 color={colors.yellow800} />
    } else if (isSynced) {
        statusIcon = <div className={styles.topRightTriangle} />
    }
    return (
        <div className={cx(styles.topRightIndicator, styles.hideForPrint)}>
            {statusIcon}
        </div>
    )
}
SyncStatusIndicator.propTypes = {
    error: PropTypes.object,
    isLoading: PropTypes.bool,
    isSynced: PropTypes.bool,
}

/** Grey triangle in bottom left of cell */
const CommentIndicator = ({ hasComment }) => {
    return (
        <div className={cx(styles.bottomRightIndicator, styles.hideForPrint)}>
            {hasComment && <div className={styles.bottomRightTriangle} />}
        </div>
    )
}
CommentIndicator.propTypes = { hasComment: PropTypes.bool }

/**
 * This inner wrapper provides styles and layout for the entry field based on
 * its various states
 */
export function InnerWrapper({
    children,
    disabled,
    locked,
    fieldname,
    deId,
    cocId,
    highlighted,
}) {
    const hasComment = useValueStore((state) =>
        state.hasComment({
            dataElementId: deId,
            categoryOptionComboId: cocId,
        })
    )

    const {
        input: { value },
        meta: { invalid, active, data, dirty, error },
    } = useField(fieldname, {
        // by default undefined is formatted to ''
        // this preserves the format used in the input-component
        format: (v) => v,
        subscription: {
            value: true,
            invalid: true,
            active: true,
            data: true,
            dirty: true,
            error: true,
        },
    })
    const form = useForm()

    // initalize lastSyncedValue
    useEffect(
        () => {
            form.mutators.setFieldData(fieldname, {
                lastSyncedValue: value,
            })
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        []
    )

    const dataValueParams = useDataValueParams({ deId, cocId })
    // Detect if this field is sending data
    const activeMutations = useIsMutating({
        mutationKey: dataValueMutationKeys.all(dataValueParams),
    })
    const syncError = useSyncErrorsStore((state) =>
        state.getErrorByDataValueParams(dataValueParams)
    )
    const clearSyncError = useSyncErrorsStore(
        (state) => state.clearErrorByDataValueParams
    )
    const errorMessage = error ?? syncError?.displayMessage
    const synced = dirty && data.lastSyncedValue === value
    // todo: maybe use mutation state to improve this style handling
    // see https://dhis2.atlassian.net/browse/TECH-1316
    const cellStateClassName = invalid
        ? styles.invalid
        : activeMutations === 0 && synced
        ? styles.synced
        : null

    // clear error if reset to initital-value
    useEffect(() => {
        if (!dirty || synced) {
            clearSyncError(dataValueParams)
        }
    }, [clearSyncError, dirty, dataValueParams, synced])

    return (
        <ValidationTooltip
            fieldname={fieldname}
            active={active}
            invalid={invalid || !!syncError}
            content={errorMessage}
        >
            <div
                className={cx(styles.cellInnerWrapper, cellStateClassName, {
                    [styles.active]: active,
                    [styles.highlighted]: highlighted,
                    [styles.disabled]: disabled,
                    [styles.locked]: locked,
                })}
            >
                {children}
                <SyncStatusIndicator
                    isLoading={activeMutations > 0}
                    isSynced={synced}
                    error={syncError}
                />
                <CommentIndicator hasComment={hasComment} />
            </div>
        </ValidationTooltip>
    )
}
InnerWrapper.propTypes = {
    children: PropTypes.node,
    cocId: PropTypes.string,
    deId: PropTypes.string,
    disabled: PropTypes.bool,
    fieldname: PropTypes.string,
    highlighted: PropTypes.bool,
    locked: PropTypes.bool,
}
