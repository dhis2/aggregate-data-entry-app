import { CssVariables } from '@dhis2/ui'
import React from 'react'
import { HashRouter as Router, Route } from 'react-router-dom'
import { QueryParamProvider } from 'use-query-params'
import './app.css'
import { ContextSelection } from '../context-selection/index.js'
import { DataWorkspace } from '../data-workspace/index.js'
import { Sidebar } from '../sidebar/index.js'
import { Layout } from './layout/index.js'
import { MutationIndicator } from './mutation-indicator/index.js'
import useConfigureQueryClient from './use-configure-query-client.js'

/**
 * "use-query-params" requires a router. It suggests react-router-dom in the
 * docs, so that's why I chose that one. Unfortunately it doesn't work with
 * react-router-dom@6, so I have do go with react-router-dom@^5
 */
const App = () => {
    useConfigureQueryClient()

    // TODO: fetch this instead of hardcoding
    const currentItem = {
        id: 'aC392Jk3200',
        name: 'Malaria treated at PHU without ACT',
        code: 'DE2398742',
        lastUpdated: {
            at: new Date('2022-01-14'),
            userDisplayName: 'Mwangi Babatunde',
        },
        markedForFollowup: false,
        type: 'numerical',
    }
    const handleSidebarClose = () => {}
    const handleMarkForFollowup = () => {}
    const handleUnmarkForFollowup = () => {}
    const showSidebar = !!currentItem

    return (
        <Router>
            <QueryParamProvider ReactRouterRoute={Route}>
                <CssVariables colors spacers theme />
                <Layout
                    header={<ContextSelection />}
                    main={<DataWorkspace />}
                    sidebar={
                        currentItem ? (
                            <Sidebar
                                item={currentItem}
                                onMarkForFollowup={handleMarkForFollowup}
                                onUnmarkForFollowup={handleUnmarkForFollowup}
                                onClose={handleSidebarClose}
                            />
                        ) : null
                    }
                    showSidebar={showSidebar}
                    footer={<MutationIndicator />}
                    showFooter
                />
            </QueryParamProvider>
        </Router>
    )
}

export default App
