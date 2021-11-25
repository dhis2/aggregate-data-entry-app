import i18n from '@dhis2/d2-i18n'
import { node, bool } from 'prop-types'
import React from 'react'
import { ErrorMessage } from '../../shared/index.js'

const AuthWall = ({ isAuthorized, children }) => {
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
    children: node.isRequired,
    isAuthorized: bool.isRequired,
}

export default AuthWall
