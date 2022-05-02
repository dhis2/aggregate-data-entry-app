import { CircularLoader, CenteredContent } from '@dhis2/ui'
import { node } from 'prop-types'
import React from 'react'
import { useCustomFormsPrefetch } from '../custom-forms/index.js'
import { useMetadata } from '../metadata/index.js'
import css from './load-app.module.css'
/**
 * "use-query-params" requires a router. It suggests react-router-dom in the
 * docs, so that's why I chose that one. Unfortunately it doesn't work with
 * react-router-dom@6, so I have do go with react-router-dom@^5
 */
const LoadApp = ({ children }) => {
    useCustomFormsPrefetch()
    const { isLoading, isError, data } = useMetadata()

    if (isLoading) {
        return (
            <CenteredContent className={css.center} position={'top'}>
                <CircularLoader />
            </CenteredContent>
        )
    }

    if (isError) {
        console.error(data)
        return 'Error!'
    }

    return children
}

LoadApp.propTypes = {
    children: node,
}

export default LoadApp
