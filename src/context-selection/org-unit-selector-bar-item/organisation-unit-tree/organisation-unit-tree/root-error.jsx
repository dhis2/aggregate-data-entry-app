import i18n from '@dhis2/d2-i18n'
import PropTypes from 'prop-types'
import React from 'react'

export const RootError = ({
    dataTest = 'dhis2-uiwidgets-orgunittree-error',
    error,
}) => (
    <div data-test={dataTest}>
        {i18n.t('Error: {{ ERRORMESSAGE }}', {
            ERRORMESSAGE: error,
            nsSeparator: '>',
        })}
    </div>
)

RootError.propTypes = {
    error: PropTypes.string.isRequired,
    dataTest: PropTypes.string,
}
