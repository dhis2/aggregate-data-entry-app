import React, { useState } from 'react'
import './app.css'
import { ValidationResultsSidebar } from '../bottom-bar/index.js'
import { ContextualHelpSidebar } from '../context-selection/contextual-help-sidebar/index.js'
import { ContextSelection } from '../context-selection/index.js'
import { DataWorkspace, DataDetailsSidebar } from '../data-workspace/index.js'
import {
    RightHandPanel,
    useRightHandPanelContext,
} from '../right-hand-panel/index.js'
import {
    contextualHelpSidebarId,
    dataDetailsSidebarId,
    validationResultsSidebarId,
} from '../shared/index.js'
import { Layout } from './layout/index.js'
import LoadApp from './load-app.js'
// import { MutationIndicator } from './mutation-indicator/index.js'

const idSidebarMap = {
    [contextualHelpSidebarId]: ContextualHelpSidebar,
    [dataDetailsSidebarId]: DataDetailsSidebar,
    [validationResultsSidebarId]: ValidationResultsSidebar,
}

/**
 * "use-query-params" requires a router. It suggests react-router-dom in the
 * docs, so that's why I chose that one. Unfortunately it doesn't work with
 * react-router-dom@6, so I have do go with react-router-dom@^5
 */
const App = () => {
    const { id } = useRightHandPanelContext()
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
