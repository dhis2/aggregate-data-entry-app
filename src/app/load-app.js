import { useDataQuery } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import { CircularLoader, CenteredContent, NoticeBox } from '@dhis2/ui'
import { node } from 'prop-types'
import React from 'react'
import { useCustomFormsPrefetch } from '../custom-forms/index.js'
import { useMetadata, useUserInfoStore } from '../shared/index.js'
import css from './load-app.module.css'

const query = {
    user: {
        resource: 'me',
        params: {
            fields: ['authorities', 'avatar', 'email', 'name', 'settings'],
        },
    },
}

const LoadApp = ({ children }) => {
    useCustomFormsPrefetch()
    const updateStore = useUserInfoStore((state) => state.setAuthorities)
    const {
        loading: userLoading,
        error: userError,
        data: userData,
    } = useDataQuery(query, {
        onComplete: (userData) => {
            updateStore(userData.user?.authorities)
        },
    })

    const { isLoading, isError, data, error } = useMetadata()

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

    if (data && (userData || userError)) {
        return children
    }
}

LoadApp.propTypes = {
    children: node,
}

export default LoadApp
