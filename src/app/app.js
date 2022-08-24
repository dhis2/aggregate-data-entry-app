import React from 'react'
import './app.css'
import { ContextualHelpSidebar } from '../context-selection/contextual-help-sidebar/index.js'
import { ContextSelection } from '../context-selection/index.js'
import {
    DataWorkspace,
    DataDetailsSidebar,
    contextualHelpSidebarId,
    dataDetailsSidebarId,
    validationResultsSidebarId,
    ValidationResultsSidebar,
} from '../data-workspace/index.js'
import {
    RightHandPanel,
    useRightHandPanelContext,
} from '../right-hand-panel/index.js'
import { Layout } from './layout/index.js'
import LoadApp from './load-app.js'
// import { MutationIndicator } from './mutation-indicator/index.js'

const idSidebarMap = {
    [dataDetailsSidebarId]: DataDetailsSidebar,
    [validationResultsSidebarId]: ValidationResultsSidebar,
    [contextualHelpSidebarId]: ContextualHelpSidebar,
}

/**
 * "use-query-params" requires a router. It suggests react-router-dom in the
 * docs, so that's why I chose that one. Unfortunately it doesn't work with
 * react-router-dom@6, so I have do go with react-router-dom@^5
 */
const App = () => {
    const { id } = useRightHandPanelContext()

    const contextSelection = <ContextSelection />

    const dataWorkspace = <DataWorkspace />

    return (
        <LoadApp>
            <Layout
                header={contextSelection}
                main={dataWorkspace}
                sidebar={<RightHandPanel idSidebarMap={idSidebarMap} />}
                showSidebar={!!id}
                // footer={<MutationIndicator />}
            />
        </LoadApp>
    )
}

export default App
