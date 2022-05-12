import { IconMore16, colors } from '@dhis2/ui'
import cx from 'classnames'
import PropTypes from 'prop-types'
import React from 'react'
import { useField } from 'react-final-form'
import { useIsMutating } from 'react-query'
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
export function InnerWrapper({ children, fieldname, syncStatus }) {
    const [deId, cocId] = fieldname.split('.')
    const {
        meta: { active, invalid },
    } = useField(fieldname, { subscription: { active: true, invalid: true } })
    // Detect if this field is sending data
    // (is this performant?)
    const activeMutations = useIsMutating({
        predicate: (mutation) => {
            const { de, co } = mutation.options.variables
            return deId === de && cocId === co
        },
    })

    const cellStateClassName = invalid
        ? styles.invalid
        : activeMutations === 0 && syncStatus.synced
        ? styles.synced
        : null

    return (
        <div
            className={cx(styles.cellInnerWrapper, cellStateClassName, {
                [styles.active]: active,
                [styles.disabled]: false, // todo
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
    fieldname: PropTypes.string,
    syncStatus: PropTypes.shape({
        synced: PropTypes.bool,
        syncing: PropTypes.bool,
    }),
}
