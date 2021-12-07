import { CssVariables } from '@dhis2/ui'
import React from 'react'
import './app.css'
import { DataWorkspace } from '../data-workspace/index.js'
import { Layout } from './layout/index.js'

const App = () => {
    return (
        <>
            <CssVariables colors />
            <Layout
                header=""
                main={<DataWorkspace />}
                sidebar=""
                footer=""
                showSidebar
                showFooter
            />
        </>
    )
}

export default App
