import i18n from '@dhis2/d2-i18n'
import { NoticeBox } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'

const LoadingError = ({ title }) => (
    <NoticeBox error title={title}>
        {i18n.t('Try again, or contact your system administrator.')}
    </NoticeBox>
)

LoadingError.propTypes = {
    title: PropTypes.string.isRequired,
}

export default LoadingError
