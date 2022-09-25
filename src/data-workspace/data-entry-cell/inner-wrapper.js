import { IconMore16, colors } from '@dhis2/ui'
import { useIsMutating } from '@tanstack/react-query'
import cx from 'classnames'
import PropTypes from 'prop-types'
import React, { useEffect } from 'react'
import { useField, useForm } from 'react-final-form'
import {
    mutationKeys as dataValueMutationKeys,
    useDataValueParams,
    useHighlightedFieldIdContext,
    useValueStore,
} from '../../shared/index.js'
import styles from './data-entry-cell.module.css'

/** Three dots or triangle in top-right corner of cell */
const SyncStatusIndicator = ({ isLoading, isSynced }) => {
    return (
        <div className={styles.topRightIndicator}>
            {isLoading ? (
                <IconMore16 color={colors.grey700} />
            ) : isSynced ? (
                <div className={styles.topRightTriangle} />
            ) : null}
        </div>
    )
}
SyncStatusIndicator.propTypes = {
    isLoading: PropTypes.bool,
    isSynced: PropTypes.bool,
}

/** Grey triangle in bottom left of cell */
const CommentIndicator = ({ hasComment }) => {
    return (
        <div className={styles.bottomRightIndicator}>
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
}) {
    const hasComment = useValueStore((state) =>
        state.hasComment({
            dataElementId: deId,
            categoryOptionComboId: cocId,
        })
    )
    const { item } = useHighlightedFieldIdContext()
    const highlighted = item && deId === item.de.id && cocId === item.coc.id
    const {
        input: { value },
        meta: { invalid, active, data, dirty },
    } = useField(fieldname, {
        subscription: {
            value: true,
            invalid: true,
            active: true,
            data: true,
            dirty: true,
        },
    })
    const form = useForm()

    // initalize lastSyncedValue
    useEffect(
        () =>
            form.mutators.setFieldData(fieldname, {
                lastSyncedValue: value,
            }),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        []
    )
    const synced = dirty && data.lastSyncedValue === value
    // Detect if this field is sending data
    const dataValueParams = useDataValueParams({ deId, cocId })
    const activeMutations = useIsMutating({
        mutationKey: dataValueMutationKeys.all(dataValueParams),
    })

    // todo: maybe use mutation state to improve this style handling
    // see https://dhis2.atlassian.net/browse/TECH-1316
    const cellStateClassName = invalid
        ? styles.invalid
        : activeMutations === 0 && synced
        ? styles.synced
        : null

    return (
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
            />
            <CommentIndicator hasComment={hasComment} />
        </div>
    )
}
InnerWrapper.propTypes = {
    children: PropTypes.node,
    cocId: PropTypes.string,
    deId: PropTypes.string,
    disabled: PropTypes.bool,
    fieldname: PropTypes.string,
    locked: PropTypes.bool,
}
