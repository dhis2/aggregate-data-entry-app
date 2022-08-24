import { IconMore16, colors } from '@dhis2/ui'
import cx from 'classnames'
import PropTypes from 'prop-types'
import React, { useCallback, useMemo } from 'react'
import { useField } from 'react-final-form'
import { useIsMutating } from 'react-query'
import { useSetRightHandPanel } from '../../right-hand-panel/index.js'
import { useSetHighlightedFieldIdContext } from '../../shared/index.js'
import { dataDetailsSidebarId } from '../constants.js'
import { focusNext, focusPrev } from '../focus-utils/index.js'
import { parseFieldId } from '../get-field-id.js'
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
    locked,
    fieldname,
    syncStatus,
}) {
    const { dataElementId: deId, categoryOptionComboId: cocId } =
        parseFieldId(fieldname)
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
            {/* todo: show indicator if there is a comment */}
            <CommentIndicator isComment={false} />
        </div>
    )
}
InnerWrapper.propTypes = {
    children: PropTypes.node,
    disabled: PropTypes.bool,
    fieldname: PropTypes.string,
    locked: PropTypes.bool,
    syncStatus: PropTypes.shape({
        synced: PropTypes.bool,
        syncing: PropTypes.bool,
    }),
}
