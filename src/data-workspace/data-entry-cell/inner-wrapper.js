import { IconMore16, colors } from '@dhis2/ui'
import { useIsMutating } from '@tanstack/react-query'
import cx from 'classnames'
import PropTypes from 'prop-types'
import React, { useCallback, useMemo } from 'react'
import { useField } from 'react-final-form'
import { useSetRightHandPanel } from '../../right-hand-panel/index.js'
import { useSetHighlightedFieldIdContext } from '../../shared/index.js'
import { dataDetailsSidebarId } from '../constants.js'
import {
    useDataValueParams,
    getDataValueMutationKey,
} from '../data-value-mutations/index.js'
import { focusNext, focusPrev } from '../focus-utils/index.js'
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
    const {
        meta: { active, invalid },
    } = useField(fieldname, { subscription: { active: true, invalid: true } })

    // Detect if this field is sending data
    const dataValueParams = useDataValueParams({ deId, cocId })
    const activeMutations = useIsMutating({
        mutationKey: getDataValueMutationKey(dataValueParams),
    })

    const setHighlightedFieldId = useSetHighlightedFieldIdContext()
    // memoize id to prevent unnecessary useEffect calls due to object reference
    const highlightedFieldId = useMemo(() => ({ deId, cocId }), [deId, cocId])

    // used so we don't consume the "id" which
    // would cause this component to rerender
    const setRightHandPanel = useSetRightHandPanel()

    const onKeyDown = useCallback(
        (event) => {
            const { key, ctrlKey, metaKey } = event
            const ctrlXorMetaKey = ctrlKey ^ metaKey

            if (ctrlXorMetaKey && key === 'Enter') {
                setRightHandPanel(dataDetailsSidebarId)
            } else if (key === 'ArrowDown' || key === 'Enter') {
                event.preventDefault()
                focusNext()
            } else if (key === 'ArrowUp') {
                event.preventDefault()
                focusPrev()
            }
        },
        [setRightHandPanel]
    )

    const onFocus = useCallback(() => {
        setHighlightedFieldId(highlightedFieldId)
    }, [highlightedFieldId, setHighlightedFieldId])

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
                [styles.disabled]: disabled,
                [styles.locked]: locked,
            })}
            onClick={locked ? onFocus : null}
            onFocus={onFocus}
            onKeyDown={onKeyDown}
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
