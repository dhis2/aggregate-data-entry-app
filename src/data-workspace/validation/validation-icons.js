import {
    colors,
    IconErrorFilled16,
    IconErrorFilled24,
    IconWarningFilled16,
    IconWarningFilled24,
    IconInfo16,
    IconInfo24,
} from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'

export const ValidationIconLevelHigh = ({ large }) => {
    if (large) {
        return <IconErrorFilled24 color={colors.red600} />
    }

    return <IconErrorFilled16 color={colors.red600} />
}

ValidationIconLevelHigh.propTypes = {
    large: PropTypes.bool,
}

export const ValidationIconLevelMedium = ({ large }) => {
    if (large) {
        return <IconWarningFilled24 color={colors.yellow500} />
    }

    return <IconWarningFilled16 color={colors.yellow500} />
}

ValidationIconLevelMedium.propTypes = {
    large: PropTypes.bool,
}

export const ValidationIconLevelLow = ({ large }) => {
    if (large) {
        return <IconInfo24 color={colors.grey600} />
    }

    return <IconInfo16 color={colors.grey600} />
}

ValidationIconLevelLow.propTypes = {
    large: PropTypes.bool,
}
