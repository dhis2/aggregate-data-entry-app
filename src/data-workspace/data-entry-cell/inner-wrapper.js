import { IconMore16, colors } from '@dhis2/ui'
import { useIsMutating } from '@tanstack/react-query'
import cx from 'classnames'
import PropTypes from 'prop-types'
import React from 'react'
import { useField } from 'react-final-form'
import { useHighlightedFieldIdContext } from '../../shared/index.js'
import {
    useDataValueParams,
    mutationKeys as dataValueMutationKeys,
} from '../data-value-mutations/index.js'
import { useHasComment } from '../has-comment/has-comment-context.js'
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
    syncStatus,
}) {
    const hasComment = useHasComment(fieldname)
    const { item } = useHighlightedFieldIdContext()
    const highlighted = item && deId === item.de.id && cocId === item.coc.id
    const {
        meta: { invalid, active },
    } = useField(fieldname, { subscription: { invalid: true, active: true } })

    // Detect if this field is sending data
    const dataValueParams = useDataValueParams({ deId, cocId })
    const activeMutations = useIsMutating({
        mutationKey: dataValueMutationKeys.all(dataValueParams),
    })

    // todo: maybe use mutation state to improve this style handling
    // see https://dhis2.atlassian.net/browse/TECH-1316
    const cellStateClassName = invalid
        ? styles.invalid
        : activeMutations === 0 && syncStatus.synced
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
                isSynced={syncStatus.synced}
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
    syncStatus: PropTypes.shape({
        synced: PropTypes.bool,
        syncing: PropTypes.bool,
    }),
}
