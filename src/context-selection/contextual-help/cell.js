import { IconMore16, colors } from '@dhis2/ui'
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
                    [styles.inputDisabled]: state === 'LOCKED',
                })}
            >
                {value}
            </div>
            <div className={styles.topRightIndicator}>
                {state === 'LOADING' && <IconMore16 color={colors.grey700} />}
                {state === 'SYNCED' && (
                    <div className={styles.topRightTriangle} />
                )}
            </div>
            <div className={styles.bottomLeftIndicator}>
                {state === 'HAS_COMMENT' && (
                    <div className={styles.bottomLeftTriangle} />
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
    ]).isRequired,
    value: PropTypes.string.isRequired,
}

export default Cell
