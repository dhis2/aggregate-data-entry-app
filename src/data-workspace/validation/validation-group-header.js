import i18n from '@dhis2/d2-i18n'
import PropTypes from 'prop-types'
import React from 'react'
import { ImportanceLevelPropTypes } from './validation-result-prop-types.js'

function getValidationGroupHeader({ level, validationViolations }) {
    if (validationViolations.length === 1) {
        if (level === 'HIGH') {
            return i18n.t('1 high priority alert')
        } else if (level === 'MEDIUM') {
            return i18n.t('1 medium priority alert')
        } else {
            return i18n.t('1 low priority alert')
        }
    }

    const options = { length: validationViolations.length }

    if (level === 'HIGH') {
        return i18n.t('{{length}} high priority alerts', options)
    } else if (level === 'MEDIUM') {
        return i18n.t('{{length}} medium priority alerts', options)
    } else {
        return i18n.t('{{length}} low priority alerts', options)
    }
}

export default function ValidationGroupHeader({ level, validationViolations }) {
    return (
        <h1>{getValidationGroupHeader({ level, validationViolations })}</h1>
    )
}

ValidationGroupHeader.propTypes = {
    level: ImportanceLevelPropTypes.isRequired,
    validationViolations: PropTypes.array.isRequired,
}
