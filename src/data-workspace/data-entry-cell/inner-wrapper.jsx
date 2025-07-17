import { IconMore16, IconWarningFilled16, colors } from '@dhis2/ui'
import { useIsMutating } from '@tanstack/react-query'
import cx from 'classnames'
import PropTypes from 'prop-types'
import React, { useEffect } from 'react'
import {
    mutationKeys as dataValueMutationKeys,
    useDataValueParams,
    useValueStore,
    useSyncErrorsStore,
    useEntryFormStore,
    useIsCompulsoryDataElementOperand,
} from '../../shared/index.js'
import styles from './data-entry-cell.module.css'
import { ValidationTooltip } from './validation-tooltip.jsx'

/** Three dots or triangle in top-right corner of cell */
const SyncStatusIndicator = ({ error, isLoading, isSynced, isRequired }) => {
    let statusIcon = null
    if (isLoading) {
        statusIcon = <IconMore16 color={colors.grey700} />
    } else if (error) {
        statusIcon = <IconWarningFilled16 color={colors.yellow800} />
    } else if (isSynced) {
        statusIcon = <div className={styles.topRightTriangle} />
    } else if (isRequired) {
        statusIcon = <div className={styles.topRightAsterisk}>*</div>
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
    isRequired: PropTypes.bool,
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
    valueSynced,
    active,
}) {
    const hasComment = useValueStore((state) =>
        state.hasComment({
            dataElementId: deId,
            categoryOptionComboId: cocId,
        })
    )
    const value = useValueStore((state) =>
        state.getDataValue({
            dataElementId: deId,
            categoryOptionComboId: cocId,
        })
    )
    const isRequired = useIsCompulsoryDataElementOperand({
        dataElementId: deId,
        categoryOptionComboId: cocId,
    })
    const completeAttempted = useEntryFormStore((state) =>
        state.getCompleteAttempted()
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
    const warning = useEntryFormStore((state) => state.getWarning(fieldname))
    const error = useEntryFormStore((state) => state.getError(fieldname))

    const fieldErrorMessage = error ?? warning

    const errorMessage =
        error && syncError ? (
            <div className={styles.validationTooltipMessage}>
                <div>{fieldErrorMessage}</div>
                <div>{syncError.displayMessage}</div>
            </div>
        ) : (
            fieldErrorMessage ?? syncError?.displayMessage
        )

    const showSynced = valueSynced && (!isRequired || !!value)

    // todo: maybe use mutation state to improve this style handling
    // see https://dhis2.atlassian.net/browse/TECH-1316

    const cellStateClassName =
        error || (isRequired && !value && completeAttempted)
            ? styles.invalid
            : warning
            ? styles.warning
            : activeMutations === 0 && showSynced
            ? styles.synced
            : null

    // clear error if reset to initital-value
    useEffect(() => {
        if (valueSynced) {
            clearSyncError(dataValueParams)
        }
    }, [clearSyncError, dataValueParams, valueSynced])

    return (
        <ValidationTooltip
            fieldname={fieldname}
            active={active}
            enabled={!!warning || !!error || !!syncError}
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
                    isRequired={isRequired}
                    isLoading={activeMutations > 0}
                    isSynced={showSynced}
                    error={syncError}
                />
                <CommentIndicator hasComment={hasComment} />
            </div>
        </ValidationTooltip>
    )
}
InnerWrapper.propTypes = {
    active: PropTypes.bool,
    children: PropTypes.node,
    cocId: PropTypes.string,
    deId: PropTypes.string,
    disabled: PropTypes.bool,
    fieldname: PropTypes.string,
    highlighted: PropTypes.bool,
    locked: PropTypes.bool,
    valueSynced: PropTypes.bool,
}
