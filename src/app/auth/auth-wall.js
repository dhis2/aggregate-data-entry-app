import i18n from '@dhis2/d2-i18n'
import PropTypes from 'prop-types'
import React from 'react'
import { ErrorMessage } from '../../shared/index.js'
import { useIsAuthorized } from './use-is-authorized.js'

const AuthWall = ({ children }) => {
    const isAuthorized = useIsAuthorized()

    if (!isAuthorized) {
        return (
            <ErrorMessage title={i18n.t('Not authorized')}>
                {i18n.t(
                    "You don't have access to the Data Approval App. Contact a system administrator to request access."
                )}
            </ErrorMessage>
        )
    }

    return children
}

AuthWall.propTypes = {
    children: PropTypes.node.isRequired,
}

export { AuthWall }
