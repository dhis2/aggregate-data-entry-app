import { CssVariables } from '@dhis2/ui'
import React from 'react'
import { QueryClientProvider } from 'react-query'
import { HashRouter as Router, Route } from 'react-router-dom'
import { QueryParamProvider } from 'use-query-params'
import { RightHandPanelProvider } from '../right-hand-panel/index.js'
import { CurrentItemProvider } from '../shared/index.js'
import App from './app.js'
import useQueryClient from './query-client/use-query-client.js'

const AppWrapper = () => {
    const queryClient = useQueryClient()

    return (
        <>
            <CssVariables colors spacers theme />
            <QueryClientProvider client={queryClient}>
                <Router>
                    <QueryParamProvider ReactRouterRoute={Route}>
                        <CurrentItemProvider>
                            <RightHandPanelProvider>
                                <App />
                            </RightHandPanelProvider>
                        </CurrentItemProvider>
                    </QueryParamProvider>
                </Router>
            </QueryClientProvider>
        </>
    )
}

export default AppWrapper
