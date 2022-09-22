import i18n from '@dhis2/d2-i18n'
import { CircularLoader, CenteredContent, NoticeBox } from '@dhis2/ui'
import { node } from 'prop-types'
import React from 'react'
import { useCustomFormsPrefetch } from '../custom-forms/index.js'
import { useMetadata, useUserInfo } from '../shared/index.js'
import css from './load-app.module.css'

const LoadApp = ({ children }) => {
    useCustomFormsPrefetch()

    const { isLoading, isError, data, error } = useMetadata()
    const {
        isLoading: userLoading,
        isError: userIsError,
        data: userData,
    } = useUserInfo()

    if (isLoading || userLoading) {
        return (
            <CenteredContent className={css.center} position={'top'}>
                <CircularLoader />
            </CenteredContent>
        )
    }

    if (isError) {
        console.error(data)
        return (
            <NoticeBox
                className={css.noticeBoxWrapper}
                error
                title={i18n.t('There was a problem loading metadata')}
            >
                {error?.message}
            </NoticeBox>
        )
    }

    if (data && (userData || userIsError)) {
        return children
    }
}

LoadApp.propTypes = {
    children: node,
}

export default LoadApp
