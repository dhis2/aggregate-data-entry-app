import { IconMore16, IconWarningFilled16, colors } from '@dhis2/ui'
import cx from 'classnames'
import PropTypes from 'prop-types'
import React from 'react'
import styles from './cell.module.css'

const Cell = ({ value, state }) => (
    <div className={styles.cell}>
        <div className={styles.cellInnerWrapper}>
            <div
                className={cx(styles.input, {
                    [styles.inputInvalid]: state === 'INVALID',
                    [styles.inputSynced]: state === 'SYNCED',
                    [styles.inputLocked]: state === 'LOCKED',
                })}
            >
                {value}
            </div>
            <div className={styles.topRightIndicator}>
                {state === 'LOADING' && <IconMore16 color={colors.grey700} />}
                {state === 'ERROR' && (
                    <IconWarningFilled16 color={colors.yellow800} />
                )}
                {state === 'SYNCED' && (
                    <div className={styles.topRightTriangle} />
                )}
            </div>
            <div className={styles.bottomRightIndicator}>
                {state === 'HAS_COMMENT' && (
                    <div className={styles.bottomRightTriangle} />
                )}
            </div>
        </div>
    </div>
)

Cell.propTypes = {
    state: PropTypes.oneOf([
        'SYNCED',
        'LOADING',
        'HAS_COMMENT',
        'INVALID',
        'LOCKED',
        'ERROR',
    ]).isRequired,
    value: PropTypes.string.isRequired,
}

export default Cell
