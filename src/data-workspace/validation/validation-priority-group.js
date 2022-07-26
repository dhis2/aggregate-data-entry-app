import cx from 'classnames'
import PropTypes from 'prop-types'
import React from 'react'
import ValidationGroupHeader from './validation-group-header.js'
import {
    ValidationIconLevelHigh,
    ValidationIconLevelMedium,
    ValidationIconLevelLow,
} from './validation-icons.js'
import styles from './validation-priority-group.module.css'
import {
    ImportanceLevelPropTypes,
    ValidationRuleViolationWithMetaDataPropTypes,
} from './validation-result-prop-types.js'
import ValidationViolations from './validation-violations.js'

const ValidationPriortyHighGroup = ({ validationViolations }) => (
    <div data-test={`priority-group-high`}>
        <div className={styles.titleWrapper}>
            <div className={cx(styles.icon, styles.error)}>
                <ValidationIconLevelHigh large />
            </div>

            <ValidationGroupHeader
                level="HIGH"
                validationViolations={validationViolations}
            />
        </div>

        <ValidationViolations
            validationViolations={validationViolations}
            className={styles.error}
        />
    </div>
)

ValidationPriortyHighGroup.propTypes = {
    validationViolations: PropTypes.arrayOf(
        ValidationRuleViolationWithMetaDataPropTypes
    ).isRequired,
}

const ValidationPriortyMediumGroup = ({ validationViolations }) => (
    <div data-test={`priority-group-medium`}>
        <div className={styles.titleWrapper}>
            <div className={cx(styles.icon, styles.warning)}>
                <ValidationIconLevelMedium large />
            </div>

            <ValidationGroupHeader
                level="MEDIUM"
                validationViolations={validationViolations}
            />
        </div>

        <ValidationViolations
            validationViolations={validationViolations}
            className={styles.warning}
        />
    </div>
)

ValidationPriortyMediumGroup.propTypes = {
    validationViolations: PropTypes.arrayOf(
        ValidationRuleViolationWithMetaDataPropTypes
    ).isRequired,
}

const ValidationPriortyLowGroup = ({ validationViolations }) => (
    <div data-test={`priority-group-low`}>
        <div className={styles.titleWrapper}>
            <div className={cx(styles.icon, styles.info)}>
                <ValidationIconLevelLow large />
            </div>

            <ValidationGroupHeader
                level="LOW"
                validationViolations={validationViolations}
            />
        </div>

        <ValidationViolations
            validationViolations={validationViolations}
            className={styles.info}
        />
    </div>
)

ValidationPriortyLowGroup.propTypes = {
    validationViolations: PropTypes.arrayOf(
        ValidationRuleViolationWithMetaDataPropTypes
    ).isRequired,
}

const ValidationPriortyGroup = ({ level, validationViolations = [] }) => {
    if (validationViolations?.length === 0) {
        return null
    }

    const Component = level === 'HIGH'
        ? ValidationPriortyHighGroup
        : level === 'MEDIUM'
        ? ValidationPriortyMediumGroup
        : ValidationPriortyLowGroup

    return <Component validationViolations={validationViolations} />
}

ValidationPriortyGroup.propTypes = {
    level: ImportanceLevelPropTypes.isRequired,
    validationViolations: PropTypes.arrayOf(
        ValidationRuleViolationWithMetaDataPropTypes
    ),
}

export default ValidationPriortyGroup
