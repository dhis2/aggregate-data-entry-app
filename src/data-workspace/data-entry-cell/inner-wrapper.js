import { IconMore16, colors } from '@dhis2/ui'
import { useIsMutating } from '@tanstack/react-query'
import cx from 'classnames'
import PropTypes from 'prop-types'
import React from 'react'
import { useField } from 'react-final-form'
import useRightHandPanelContext from '../../right-hand-panel/use-right-hand-panel-context.js'
import { useHighlightedFieldIdContext } from '../../shared/index.js'
import {
    useDataValueParams,
    getDataValueMutationKey,
} from '../data-value-mutations/index.js'
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
const CommentIndicator = ({ isComment }) => {
    return (
        <div className={styles.bottomLeftIndicator}>
            {isComment && <div className={styles.bottomLeftTriangle} />}
        </div>
    )
}
CommentIndicator.propTypes = { isComment: PropTypes.bool }

/**
 * This inner wrapper provides styles and layout for the entry field based on
 * its various states
 */
export function InnerWrapper({
    children,
    disabled,
    fieldname,
    deId,
    cocId,
    syncStatus,
    keptInFocus,
}) {
    const {
        meta: { active, invalid },
    } = useField(fieldname, { subscription: { active: true, invalid: true } })

    // Detect if this field is sending data
    const dataValueParams = useDataValueParams({ deId, cocId })
    const activeMutations = useIsMutating({
        mutationKey: getDataValueMutationKey(dataValueParams),
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
                [styles.active]: active || keptInFocus,
                [styles.disabled]: disabled,
            })}
        >
            {children}
            <SyncStatusIndicator
                isLoading={activeMutations > 0}
                isSynced={syncStatus.synced}
            />
            {/* todo: show indicator if there is a comment */}
            <CommentIndicator isComment={false} />
        </div>
    )
}
InnerWrapper.propTypes = {
    children: PropTypes.node,
    cocId: PropTypes.string,
    deId: PropTypes.string,
    disabled: PropTypes.bool,
    fieldname: PropTypes.string,
    keptInFocus: PropTypes.bool,
    syncStatus: PropTypes.shape({
        synced: PropTypes.bool,
        syncing: PropTypes.bool,
    }),
}
