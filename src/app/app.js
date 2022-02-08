import { CssVariables } from '@dhis2/ui'
import React from 'react'
import { HashRouter as Router, Route } from 'react-router-dom'
import { QueryParamProvider } from 'use-query-params'
import './app.css'
import { ContextSelection } from '../context-selection/index.js'
import { CurrentItemProvider } from '../current-item-provider/index.js'
import { DataWorkspace } from '../data-workspace/index.js'
import { Sidebar, useSidebar, SidebarProvider } from '../sidebar/index.js'
import { Layout } from './layout/index.js'
import { MutationIndicator } from './mutation-indicator/index.js'
import useConfigureQueryClient from './use-configure-query-client.js'

const WrappedLayout = () => {
    const { visible: showSidebar } = useSidebar()

    return (
        <Layout
            header={<ContextSelection />}
            main={<DataWorkspace />}
            sidebar={showSidebar && <Sidebar />}
            showSidebar={showSidebar}
            footer={<MutationIndicator />}
            showFooter
        />
    )
}

/**
 * "use-query-params" requires a router. It suggests react-router-dom in the
 * docs, so that's why I chose that one. Unfortunately it doesn't work with
 * react-router-dom@6, so I have do go with react-router-dom@^5
 */
const App = () => {
    useConfigureQueryClient()

    return (
        <Router>
            <QueryParamProvider ReactRouterRoute={Route}>
                <CssVariables colors spacers theme />
                <CurrentItemProvider>
                    <SidebarProvider>
                        <WrappedLayout />
                    </SidebarProvider>
                </CurrentItemProvider>
            </QueryParamProvider>
        </Router>
    )
}

export default App
