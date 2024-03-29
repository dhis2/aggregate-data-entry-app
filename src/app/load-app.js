import i18n from '@dhis2/d2-i18n'
import { CircularLoader, CenteredContent, NoticeBox } from '@dhis2/ui'
import { node } from 'prop-types'
import React from 'react'
import { useCustomFormsPrefetch } from '../custom-forms/index.js'
import { useMetadata, useUserInfo } from '../shared/index.js'
import css from './load-app.module.css'

const LoadApp = ({ children }) => {
    useCustomFormsPrefetch()

    const metadata = useMetadata()
    const userInfo = useUserInfo()

    if (metadata.isLoading || userInfo.isLoading) {
        return (
            <CenteredContent className={css.center} position={'top'}>
                <CircularLoader />
            </CenteredContent>
        )
    }

    if (metadata.isError) {
        console.error(metadata.error.message, metadata.error.details)
        return (
            <NoticeBox
                error
                className={css.noticeBoxWrapper}
                title={i18n.t('There was a problem loading metadata')}
            >
                {metadata.error.message}
            </NoticeBox>
        )
    }

    if (userInfo.isError) {
        console.error(userInfo.error.message, userInfo.error.details)
        return (
            <NoticeBox
                error
                className={css.noticeBoxWrapper}
                title={i18n.t(
                    "There was a problem loading the user's information"
                )}
            >
                {userInfo.error.message}
            </NoticeBox>
        )
    }

    return children
}

LoadApp.propTypes = {
    children: node,
}

export default LoadApp
