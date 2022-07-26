import i18n from '@dhis2/d2-i18n'
import cx from 'classnames'
import PropTypes from 'prop-types'
import React from 'react'
import { ValidationIconLevelHigh } from './validation-icons.js'
import { ImportanceLevelPropTypes } from './validation-result-prop-types.js'
import styles from './validation-summary-box.module.css'

const ValidationSummaryBoxHigh = ({ count, hideCounts }) => (
    <div
        data-test={`count-high`}
        className={cx(
            styles.summaryBox,
            styles.error,
            { [styles.hideCounts]: hideCounts }
        )}
    >
        <div className={styles.title}>
            <ValidationIconLevelHigh />
            <span>{i18n.t('High')}</span>
        </div>

        <div className={styles.count}>{count}</div>
    </div>
)

ValidationSummaryBoxHigh.propTypes = {
    count: PropTypes.number.isRequired,
    hideCounts: PropTypes.bool.isRequired,
}

const ValidationSummaryBoxMedium = ({ count, hideCounts }) => (
    <div
        data-test={`count-medium`}
        className={cx(
            styles.summaryBox,
            styles.warning,
            { [styles.hideCounts]: hideCounts }
        )}
    >
        <div className={styles.title}>
            <ValidationIconLevelHigh />
            <span>{i18n.t('Medium')}</span>
        </div>

        <div className={styles.count}>{count}</div>
    </div>
)

ValidationSummaryBoxMedium.propTypes = {
    count: PropTypes.number.isRequired,
    hideCounts: PropTypes.bool.isRequired,
}

const ValidationSummaryBoxLow = ({ count, hideCounts }) => (
    <div
        data-test={`count-low`}
        className={cx(
            styles.summaryBox,
            styles.info,
            { [styles.hideCounts]: hideCounts }
        )}
    >
        <div className={styles.title}>
            <ValidationIconLevelHigh />
            <span>{i18n.t('Medium')}</span>
        </div>

        <div className={styles.count}>{count}</div>
    </div>
)

ValidationSummaryBoxLow.propTypes = {
    count: PropTypes.number.isRequired,
    hideCounts: PropTypes.bool.isRequired,
}

const ValidationSummaryBox = ({ level, count, hideCounts }) => {
    const Component = level === 'HIGH'
        ? ValidationSummaryBoxHigh
        : level === 'MEDIUM'
        ? ValidationSummaryBoxMedium
        : ValidationSummaryBoxLow

    return (
        <Component
            count={count}
            hideCounts={hideCounts}
        />
    )
}

ValidationSummaryBox.propTypes = {
    count: PropTypes.number.isRequired,
    hideCounts: PropTypes.bool.isRequired,
    level: ImportanceLevelPropTypes.isRequired,
}

export default ValidationSummaryBox
