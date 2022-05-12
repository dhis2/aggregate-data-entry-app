import { CssVariables } from '@dhis2/ui'
import React, { useState } from 'react'
import { HashRouter as Router, Route } from 'react-router-dom'
import { QueryParamProvider } from 'use-query-params'
import './app.css'
import { ContextSelection } from '../context-selection/index.js'
import { DataWorkspace } from '../data-workspace/index.js'
import { Sidebar, useSidebar } from '../sidebar/index.js'
import { Layout } from './layout/index.js'
import LoadApp from './load-app.js'
import { MutationIndicator } from './mutation-indicator/index.js'
/**
 * "use-query-params" requires a router. It suggests react-router-dom in the
 * docs, so that's why I chose that one. Unfortunately it doesn't work with
 * react-router-dom@6, so I have do go with react-router-dom@^5
 */
const App = () => {
    const { visible: showSidebar } = useSidebar()
    const [selectionHasNoFormMessage, setSelectionHasNoFormMessage] =
        useState('')

    const contextSelection = (
        <ContextSelection
            setSelectionHasNoFormMessage={setSelectionHasNoFormMessage}
        />
    )

    const dataWorkspace = (
        <DataWorkspace selectionHasNoFormMessage={selectionHasNoFormMessage} />
    )

    return (
        <Router>
            <QueryParamProvider ReactRouterRoute={Route}>
                <CssVariables colors spacers theme />
                <LoadApp>
                    <Layout
                        header={contextSelection}
                        main={dataWorkspace}
                        sidebar={showSidebar && <Sidebar />}
                        showSidebar={showSidebar}
                        footer={<MutationIndicator />}
                        showFooter
                    />
                </LoadApp>
            </QueryParamProvider>
        </Router>
    )
}

export default App
